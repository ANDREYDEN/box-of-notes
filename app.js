const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const { generateBoxCode, formatDate, openBox } = require('./src/functions')
const api = require('./src/api')
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
        api.getBoxByCode(req.params.code)
            .then(box => {        
                resp.render('pages/newNote', {
                    loadingError: loadingError,
                    formErrors: [],
                    body: req.body,
                    boxCode: req.params.code,
                    fields: {
                        boxId: (loadingError == '') ? box.boxId : 0,
                        description: (loadingError == '') ? box.details : ''
                    }
                })
            })
    }
)

app.post('/box/:code/submit', 
    body('message', 'Sorry, your note is too long').isLength({ max: 255 }),
    (req, resp) => {
        // check if the box has been already opened [again]
        api.getBoxByCode(req.params.code)
            .then(box => {
                // get general input errors (express-validator)
                var formErrors = validationResult(req)

                if (box.opened) {
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
                            box: box
                        })
                    })
                }
            })
    }
)

///////////////////////////////////// BOX PAGE ////////////////////////////////////////

app.get('/box/:code', (req, resp) => {
    api.getBoxByCode(req.params.code)
        .then(box =>
            resp.render('pages/boxPage', {
                box: box
            })
        )
})

app.get('/box/:code/content', (req, resp) => {
    api.getBoxByCode(req.params.code)
        .then(box => {
            if (!box.opened) {
                resp.redirect(`/box/${req.params.code}`)
            } else {
                api.getNotesFromBox(req.params.code)
                    .then(notes => {
                        resp.render('pages/boxContent', {
                            box: box,
                            notes: notes
                        })
                    })
            }
        })
})

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server started on port ' + PORT)
})