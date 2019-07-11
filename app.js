const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const nodemailer = require('nodemailer')

///////////////////////////////////// DB SETUP ////////////////////////////////////////

// decide what port to run on to (heroku vs local)
var runningLocally = true
const localPort = '8000'
let PORT = process.env.PORT

if (PORT == null || PORT == '') {
    PORT = localPort
    runningLocally = false
}

// if (runningLocally) {
//     const db = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'qwer',
//         database: 'boxofnotes'
//     })
// } else {
    const db = mysql.createConnection({
        host: 'us-cdbr-iron-east-02.cleardb.net',
        user: 'bdee3f04b93939',
        password: '93174ba8',
        database: 'heroku_9c462e64da52142'
    })
// }

// start mysql
db.connect((err) => {
    if (err) throw err
    console.log('MySQL connected')
})

///////////////////////////////////// EXPRESS SETUP ////////////////////////////////////////

const app = express()

// for POST variables
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve extra directories with files
app.use(express.static('css'))
app.use(express.static('icons'))

app.set('view engine', 'ejs');

///////////////////////////////////// EMAIL SETUP ////////////////////////////////////////

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'boxofnotes.info@gmail.com',
        pass: 'unboxing3000'
    }
});

///////////////////////////////////// FUNCTIONS ////////////////////////////////////////

// generates a random code that will be used to identify the box
function generateBoxCode() {
    let boxCode = ''
    for (let i = 0; i < 6; i++) {
        boxCode += String.fromCharCode(Math.round(Math.random() * 25) + 65)
    }
    return boxCode
}

// formats the date to 'ddd mm dd, yyyy'
function formatDate(date) {
    return date.toString().split(' ').slice(1, 5).join(' ')
}

// changes the 'opened' property to 1 in the db record with the specified (identifier, value) pair
function openBox(identifier, value) {
    // if the passed value is string - add quotes for correct SQL syntax
    if (typeof(value) == 'string') {
        value = "'" + value + "'"
    }
    let query = `UPDATE box SET opened = 1 WHERE ${identifier} = ${value}`
    console.log(`Query: ${query}`)
    db.query(query, (err, result) => {
        if (err) throw err
    })
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// PAGES ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// starting page
app.get('/', (req, resp) => {
    resp.render('pages/index')
})

///////////////////////////////////// NEW BOX ////////////////////////////////////////

app.get('/newBox', (req, resp) => {
    resp.render('pages/newBox', {
        formErrors: []
    })
})

// when a new box is created insert it in the 'box' table
app.post('/newBoxResult', 
    body('time', 'The opening time must be in the future').isAfter(Date()),
    body('email', 'Please specify your email - we will use it to send you the results').not().isIn(['', null, undefined]),
    body('details', 'Sorry, the description is too long').isLength({ max: 255 }),
    sanitizeBody('details').trim().escape(),
    sanitizeBody('email').trim(),
    (req, resp) => {
        const errors = validationResult(req)
        if (errors.array().length != 0) {
            // re-render the page with errors displaying
            resp.render('pages/newBox', {
                formErrors: errors.array(), 
                body: req.body
            })
        } else {
            var boxCode = generateBoxCode()
            let query = `INSERT INTO box(boxCode, openTime, details, email) VALUES ('${boxCode}', '${req.body.time}', '${req.body.details}', '${req.body.email}')`
            db.query(query, (err, result) => {
                if (err) {
                    throw err
                } else {
                    // send email containing box info
                    var mailOptions = {
                        from: 'boxofnotes.info@gmail.com',
                        to: req.body.email,
                        subject: 'Your new box',
                        text: 
                            'Hi there,\n' + 
                            "You've just created a new box!\n\n" +     

                            `Use this (${db.config.host}:${port}/newNote/${boxCode}) URL to submit notes to your box.\n` + 
                            `Your box will be available on ${formatDate(req.body.time)} and you will receive an email as soon as it is open.\n` +
                            `You can also use your box code ${boxCode} to open it yourself here (${db.config.host}:${port}/openBox).\n\n` +

                            'Thank you for using Box of Notes.\n\n' +

                            'Andrii Denysenko'
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) throw err
                        console.log('Email sent: ' + info.response);
                    });

                    // schedule the opening of the box for the specified time
                    console.log(req.body.time, new Date(req.body.time), new Date(), new Date(req.body.time) - new Date())
                    setTimeout(() => {openBox('boxCode', boxCode)}, new Date(req.body.time) - new Date())

                    // display the result page after a box is added
                    resp.render('pages/newBoxResult', {
                        boxCode: boxCode
                    })
                }
            })
        }
    }
)

///////////////////////////////////// NEW NOTE ////////////////////////////////////////

// when a new Note is added check the boxCode and link it to a corresponding box
app.get('/newNote/:boxCode', 
    sanitizeBody('message').trim().escape(),
    (req, resp) => {
        // find a box with specified boxCode
        let findBoxQuery = `SELECT boxId, details, opened FROM box WHERE boxCode = '${req.params.boxCode}'`
        db.query(findBoxQuery, (err, box) => {
            // check for errors
            let loadingError = ''
            if (box.length == 0) {
                loadingError = "A box with this box code doesn't exist."
            } else if (box[0].opened == 1) {
                loadingError = "This box has already been opened. You can't add notes to opened boxes."
            }

            resp.render('pages/newNote', {
                loadingError: loadingError,
                formErrors: [],
                body: req.body,
                fields: {
                    boxId: (loadingError == '') ? box[0].boxId : 0,
                    description: (loadingError == '') ? box[0].details : ''
                }
            })
        })
    }
)

app.post('/newNoteResult', 
    body('message', 'Sorry, your note is too long').isLength({ max: 255 }),
    (req, resp) => {
        // check if the box has been already opened [again]
        let getBoxQuery = `SELECT opened FROM box WHERE boxId = ${req.body.boxId}`
        db.query(getBoxQuery, (err, result) => {
            if (err) throw err

            // get general input errors (express-validator)
            var formErrors = validationResult(req).array()

            if (result[0].opened) {
                formErrors.push({ msg: "This box has already been opened. You can't add notes to opened boxes." })
            }

            if (formErrors.length != 0) {
                // re-render the page displaying the errors
                resp.render('pages/newNote', {
                    loadingError: '',
                    formErrors: formErrors,
                    body: req.body,
                    fields: {
                        boxId: req.body.boxId,
                        description: req.body.description
                    }
                })
            } else {
                // add a new note record related to the box found
                let createNoteQuery = `INSERT INTO note(boxId, message) VALUES (${req.body.boxId}, '${req.body.message}')`
                db.query(createNoteQuery, (err, result) => {
                    if (err) throw err
                    // display the result page after a note is added
                    resp.render('pages/newNoteResult')
                })
            }
        })
    }
)

///////////////////////////////////// OPEN BOX ////////////////////////////////////////

// opening a box
app.get('/openBox', (req, resp) => {
    resp.render('pages/openBox', {
        formErrors: []
    })
})

// when a box is opened check the time and display all the notes inside the box if it's available
app.post('/openBoxResult', 
    sanitizeBody('boxCode').trim().escape(),
    (req, resp) => {
        const formErrors = validationResult(req)
        if (formErrors.array().length != 0) {
            // re-render the page with errors displaying
            resp.render('pages/openBox', { 
                formErrors: formErrors.array(), 
                body: req.body 
            })
        } else {
            // find a box with specified boxCode
            let findBoxQuery = `SELECT boxId, openTime, opened FROM box WHERE boxCode = '${req.body.boxCode}'`
            db.query(findBoxQuery, (err, box) => {
                // check for any errors on form
                let formErrors = []

                if (box.length == 0) {
                    formErrors.push({ msg: "A box with this box code doesn't exist" })
                } else {
                    // compare the dates (number of seconds from 1970)
                    if (Date.parse(box[0].openTime) > Date.parse(Date().toString())) {
                        formErrors.push({ msg: `This box will be available on ${formatDate(box[0].openTime)}` }) 
                    }
                }

                if (formErrors.length != 0) {
                    resp.render('pages/openBox', {
                        formErrors: formErrors,
                        body: req.body
                    })
                } else {
                    boxId = box[0].boxId

                    // update the box record in the DB
                    openBox('boxId', boxId)

                    // find all the notes related to the current box
                    let getNotesQuery = `SELECT message FROM note WHERE note.boxId = ${boxId}`
                    db.query(getNotesQuery, (err, result) => {
                        if (err) throw err
                        // display the result page after a note is added
                        resp.render('pages/openBoxResult', {
                            fields: {
                                notes: result
                            }
                        })
                    })
                }
            })
        }
    }
)

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
})