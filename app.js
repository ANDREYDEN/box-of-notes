const dotenv = require('dotenv')
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

dotenv.config()

const Api = require('./src/api')
const apiRouter = require('./api/index')
///////////////////////////////////// DB SETUP ////////////////////////////////////////

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

const api = new Api()

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
    (req, resp, next) => {
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
                .then(boxCode => resp.redirect(`/box/${boxCode}`))
                .catch(err => next(err))
        }
    }
)

///////////////////////////////////// NEW NOTE ////////////////////////////////////////

// when a new Note is added check the boxCode and link it to a corresponding box
app.get('/box/:code/submit',
    sanitizeBody('message').trim(),
    (req, resp, next) => {
        api.getBoxByCode(req.params.code)
            .then(box => {
                resp.render('pages/newNote', {
                    formErrors: [],
                    body: req.body,
                    box: box,
                })
            })
            .catch(err => next(err))
    }
)

app.post('/box/:code/submit',
    (req, resp, next) => {
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
                    .catch(err => next(err))
            })
    }
)

///////////////////////////////////// BOX PAGE ////////////////////////////////////////

app.get('/box/:code', (req, resp, next) => {
    api.getBoxByCode(req.params.code)
        .then(box =>
            resp.render('pages/boxPage', { box: box })
        )
        .catch(err => next(err))
})

app.get('/box/:code/content', (req, resp, next) => {
    api.getBoxByCode(req.params.code)
        .then(box => {
            if (!box.isOpened()) {
                resp.redirect(`/box/${req.params.code}`)
            } else {
                api.getNotesFromBox(req.params.code)
                    .then(notes => {
                        resp.render('pages/boxContent', {
                            box: box,
                            notes: notes
                        })
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
})

///////////////////////////////////// ERRORS AND LISTENING ////////////////////////////////////////

app.all('/*', (req, resp, next) => {
    next(new Error('The page you are looking for can\'t be found'))
})

app.use((err, req, resp, next) => {
    const message = err.response ? err.response.data : err.message
    console.log('General error: ' + message);
    resp.render('pages/error', { message })
})

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server started on port ' + process.env.PORT)
})