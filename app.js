const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const nodemailer = require('nodemailer')

///////////////////////////////////// DB SETUP ////////////////////////////////////////

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwer',
    database: 'boxofnotes'
})

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

function generateBoxCode() {
    let boxCode = ''
    for (let i = 0; i < 6; i++) {
        boxCode += String.fromCharCode(Math.round(Math.random() * 25) + 65)
    }
    return boxCode
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
    sanitizeBody('details').trim().escape(),
    (req, resp) => {
        const errors = validationResult(req)
        if (errors.array().length != 0) {
            // re-render the page with errors displaying
            resp.render('pages/newBox', {
                formErrors: errors.array(), 
                body: req.body
            })
        } else {
            let boxCode = generateBoxCode()
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
                        `
                        Hi there,

                        You've just created a new box!
                        `
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

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

            if (loadingError != '') {
                resp.render('pages/newNote', { 
                    loadingError: loadingError, 
                    formErrors: [],
                    body: req.body,
                    fields: {
                        boxId: 0,
                        description: '' 
                    }
                })
            } else {
                resp.render('pages/newNote', {
                    loadingError: [],
                    formErrors: [],
                    body: req.body,
                    fields: {
                        boxId: box[0].boxId,
                        description: box[0].details
                    }
                })
            }
        })
    }
)

app.post('/newNoteResult', 
    body('message', 'Sorry, your note is too long').isLength({ max: 255 }),
    (req, resp) => {
        const formErrors = validationResult(req)
        if (formErrors.array().length != 0) {
            // re-render the page displaying the errors
            resp.render('pages/newNote', {
                loadingError: [],
                formErrors: formErrors.array(),
                body: req.body,
                fields: {
                    boxId: req.body.boxId,
                    description: req.body.description
                }
            })
        } else {
            // add a new note record related to the box found
            let query = `INSERT INTO note(boxId, message) VALUES (${req.body.boxId}, '${req.body.message}')`
            db.query(query, (err, result) => {
                if (err) throw err
                // display the result page after a note is added
                resp.render('pages/newNoteResult')
            })
        }
    }
)

///////////////////////////////////// OPEN BOX ////////////////////////////////////////

// opening a box
app.get('/openBox', (req, resp) => {
    resp.render('pages/openBox')
})

// when a box is opened check the time and display all the notes inside the box
app.post('/openBoxResult', 
    sanitizeBody('boxCode').trim().escape(),
    (req, resp) => {
        const errors = validationResult(req)
        if (errors.array().length != 0) {
            // re-render the page with errors displaying
            resp.render('pages/openBox', { errors: errors.array(), body: req.body })
        } else {
            // find a box with specified boxCode
            let findBoxQuery = `SELECT boxId, openTime FROM box WHERE boxCode = '${req.body.boxCode}'`
            db.query(findBoxQuery, (err, box) => {
                if (box.length == 0) {
                    resp.render('pages/openBox', { errors: [{ msg: "A box with this box code doesn't exist" }], body: req.body })
                    return
                }
                // compare the dates (number of seconds from 1970)
                if (Date.parse(box[0].openTime) > Date.parse(Date().toString())) {
                    resp.render('pages/openBox', { errors: [{ msg: `This box will be available on ${box[0].openTime}` }], body: req.body })
                    return
                }
                boxId = box[0].boxId

                // find all the notes related to the current box
                let getNotesQuery = `SELECT message FROM note WHERE note.boxId = ${boxId}`
                db.query(getNotesQuery, (err, result) => {
                    if (err) throw err
                    // display the result page after a note is added
                    resp.render('pages/openBoxResult', {notes: result})
                })
            })
        }
    },
)

app.listen('8000', () => {
    console.log('Server started on port 8000')
})