const dotenv = require('dotenv')
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

dotenv.config()

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
            // convert local time to epoch time
            const EPOCH_MS = new Date(req.body.time).getTime()
            api.createBox(EPOCH_MS, req.body.details)
                .then(boxCode => {
                    // schedule the opening of the box for the specified time
                    setTimeout(() =>
                        api.openBoxByCode(boxCode), 
                        EPOCH_MS - new Date().getTime()
                    )

                    // display the box page after the box was created
                    resp.redirect(`/box/${boxCode}`)
                })
        }
    }
)

///////////////////////////////////// NEW NOTE ////////////////////////////////////////

// when a new Note is added check the boxCode and link it to a corresponding box
app.get('/box/:code/submit', 
    sanitizeBody('message').trim(),
    (req, resp) => {
        api.getBoxByCode(req.params.code)
            .then(box => {
                console.log(box);
                resp.render('pages/newNote', {
                    formErrors: [],
                    body: req.body,
                    box: box,
                })
            })
    }
)

app.post('/box/:code/submit', 
    (req, resp) => {
        api.createNote(req.params.code, req.body.message)
            .then(res => {
                resp.redirect(`/box/${req.params.code}`)
            })
            .catch(err => {
                api.getBoxByCode(req.params.code)
                    .then(box => {
                        // re-render the page displaying the errors
                        resp.render('pages/newNote', {
                            formErrors: [err.message],
                            body: req.body,
                            box: box,
                        })
                    })
            })
    }
)

///////////////////////////////////// BOX PAGE ////////////////////////////////////////

app.get('/box/:code', (req, resp) => {
    api.getBoxByCode(req.params.code)
        .then(box => resp.render('pages/boxPage', { box: box }))
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