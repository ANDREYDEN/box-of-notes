const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const { generateBoxCode, formatDate, openBox } = require('./src/functions')

const apiRouter = require('./api/index')

///////////////////////////////////// DB SETUP ////////////////////////////////////////

// connect to DB and get the port from Heroku environment variables
const PORT = process.env.PORT || '8000'

const DB_URL = process.env.DATABASE_URL
const DB_URL_PARTS = DB_URL.split(/[:\/@?]/)
const db = mysql.createConnection({
    user: DB_URL_PARTS[3],
    password: DB_URL_PARTS[4],
    host: DB_URL_PARTS[5],
    database: DB_URL_PARTS[6]
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

app.use(express.static('public'))
app.use('/api', apiRouter)

app.set('view engine', 'ejs');

///////////////////////////////////// FUNCTIONS ////////////////////////////////////////

// generates a random code that will be used to identify the box


////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// PAGES ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// starting page
app.get('/', (req, resp) => {
    resp.render('pages/index')
})

///////////////////////////////////// NEW BOX ////////////////////////////////////////

app.get('/box/new', (req, resp) => {
    resp.render('pages/newBox', {
        formErrors: []
    })
})

// when a new box is created insert it in the 'box' table
app.post('/box/new', 
    // body('time', 'The opening time must be in the future').isAfter(Date()),
    body('details', 'Sorry, the description is too long').isLength({ max: 255 }),
    sanitizeBody('details').trim().escape(),
    (req, resp) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // re-render the page with errors displaying
            resp.render('pages/newBox', {
                formErrors: errors.array(), 
                body: req.body
            })
        } else {
            const BOX_CODE = generateBoxCode()
            // convert local time to epoch time
            const EPOCH_MS = new Date(req.body.time).getTime()
            let query = `INSERT INTO box(boxCode, openTime, details) VALUES ('${BOX_CODE}', '${EPOCH_MS}', '${req.body.details}')`
            db.query(query, (err, result) => {
                if (err) {
                    throw err
                } else {
                    // schedule the opening of the box for the specified time
                    setTimeout(() =>
                        openBox({
                            db: db, 
                            identifier: 'boxCode', 
                            value: BOX_CODE
                        }), 
                        EPOCH_MS - new Date().getTime()
                    )

                    // disply the box page after the box was created
                    resp.redirect(`/box/${BOX_CODE}`)
                }
            })
        }
    }
)

///////////////////////////////////// NEW NOTE ////////////////////////////////////////

// when a new Note is added check the boxCode and link it to a corresponding box
app.get('/box/:code/submit', 
    sanitizeBody('message').trim().escape(),
    (req, resp) => {
        // find a box with specified boxCode
        let findBoxQuery = `SELECT boxId, details, opened FROM box WHERE boxCode = '${req.params.code}'`
        db.query(findBoxQuery, (err, box) => {
            if (err) throw err
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
                boxCode: req.params.code,
                fields: {
                    boxId: (loadingError == '') ? box[0].boxId : 0,
                    description: (loadingError == '') ? box[0].details : ''
                }
            })
        })
    }
)

app.post('/box/:code/submit', 
    body('message', 'Sorry, your note is too long').isLength({ max: 255 }),
    (req, resp) => {
        // check if the box has been already opened [again]
        let getBoxQuery = `SELECT opened FROM box WHERE boxId = ${req.body.boxId}`
        db.query(getBoxQuery, (err, box) => {
            if (err) throw err

            // get general input errors (express-validator)
            var formErrors = validationResult(req)

            if (box[0].opened) {
                formErrors.push({ msg: "This box has already been opened. You can't add notes to opened boxes." })
            }

            if (!formErrors.isEmpty()) {
                // re-render the page displaying the errors
                resp.render('pages/newNote', {
                    loadingError: '',
                    formErrors: formErrors,
                    body: req.body,
                    boxCode: req.params.code,
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
                    resp.render('pages/boxPage', {
                        box: box[0]
                    })
                })
            }
        })
    }
)

///////////////////////////////////// BOX PAGE ////////////////////////////////////////

app.get('/box/:code', (req, resp) => {
    resp.redirect(`/api/box/${req.params.code}`)
})

// opening a box
app.get('/openBox', (req, resp) => {
    resp.render('pages/openBox', {
        formErrors: []
    })
})

app.get('/box/:code/content', (req, resp) => {

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
                    // check if the box is ready for opening
                    if (box[0].opened == 0) {
                        formErrors.push({ msg: `This box will be available on ${formatDate(new Date(box[0].openTime))}` }) 
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

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server started on port ' + PORT)
})