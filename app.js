const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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

app.set('view engine', 'ejs');

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

// creating a DB
app.get('/create-database/:name', (req, resp) => {
    let query = `CREATE DATABASE ${req.params.name}`
    db.query(query, (err, result) => {
        if (err) throw err
        console.log(result)
        resp.send(`Database ${req.params.name} created!`)
    })
})


// starting page
app.get('/', (req, resp) => {
    resp.render('pages/index')
})

///////////////////////////////////// NEW BOX ////////////////////////////////////////

app.get('/newBox', (req, resp) => {
    resp.render('pages/newBox')
})

// when a new box is created insert it in the 'box' table
app.post('/newBoxResult', 
    body('time', 'The opening time must be in the future').isAfter(Date()),
    sanitizeBody('details').trim().escape(),
    (req, resp) => {
        const errors = validationResult(req)
        if (!errors.array().length == 0) {
            // re-render the page with errors displaying
            resp.render('pages/newBox', {errors: errors.array(), body: req.body})
        } else {
            let boxCode = generateBoxCode()
            let query = `INSERT INTO box(boxCode, openTime, details) VALUES ('${boxCode}', '${req.body.time}', '${req.body.details}')`
            db.query(query, (err, result) => {
                if (err) {
                    throw err
                } else {
                    // display the result page after a box is added
                    resp.render('pages/newBoxResult', {boxCode: boxCode})
                }
            })
        }
    }
)

///////////////////////////////////// NEW NOTE ////////////////////////////////////////

// creating a note
app.get('/newNote', (req, resp) => {
    resp.render('pages/newNote', {errors: ""})
})

// when a new Note is added check the boxCode and link it to a corresponding box
app.post('/newNoteResult', 
    sanitizeBody('boxCode').trim().escape(),
    sanitizeBody('message').trim().escape(),
    (req, resp) => {
        const errors = validationResult(req)
        if (!errors.array().length == 0) {
            // re-render the page with errors displaying
            resp.render('pages/newNote', { errors: errors.array(), body: req.body })
        } else {
            // find a box with specified boxCode
            let findBoxQuery = `SELECT boxId FROM box WHERE boxCode = '${req.body.boxCode}'`
            db.query(findBoxQuery, (err, boxId) => {
                if (boxId.length == 0) {
                    resp.render('pages/newNote', { errors: [{msg: "A box with this box code doesn't exist"}], body: req.body })
                    return
                }
                boxId = boxId[0].boxId

                // add a new note record related to the box found
                let query = `INSERT INTO note(boxId, message) VALUES (${boxId}, '${req.body.message}')`
                db.query(query, (err, result) => {
                    if (err) throw err
                    // display the result page after a note is added
                    resp.render('pages/newNoteResult')
                })
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
app.post('/openBoxResult', (req, resp) => {
    // TODO: 
    //      - query = `SELECT message FROM note, box WHERE box.boxCode = ${req.body.boxCode} and note.boxId = box.boxId`
    //      - if there is no box with the specified boxCode inform the user (on the openBox page)
    //      - if the openTime is in the future, then inform the user (on the openBoxResult page)


    // find a box with specified boxCode
    let findBoxQuery = `SELECT boxId, openTime FROM box WHERE boxCode = '${req.body.boxCode}'`
    db.query(findBoxQuery, (err, boxInfo) => {
        if (err) {
            throw err
        } else {
            if (boxInfo.length == 0) {
                // display an error if the box was not found
                resp.render('pages/openBox', { errors: "A box with this box code doesn't exist" })
                return
            }
            let boxId = boxInfo[0].boxId
            let openTime = boxInfo[0].openTime

            if (openTime > Date()) {

            }

            // add a new note record related to the box found
            let query = `INSERT INTO note(boxId, message) VALUES (${boxId}, '${req.body.message}')`
            db.query(query, (err, result) => {
                if (err) {
                    // TODO:
                    //      - handle error: something went wrong
                    throw err
                } else {
                    // display the result page after a note is added
                    resp.render('pages/openBoxResult')
                }
            })
        }
    })
})



app.listen('8000', () => {
    console.log('Server started on port 8000')
})