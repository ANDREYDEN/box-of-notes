const express = require('express')
const mysql = require('mysql')
const path = require('path')
const bodyParser = require('body-parser');

///////////////////////////////////// SETUP ////////////////////////////////////////

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwer',
    database: 'boxofnotes'
})

db.connect((err) => {
    if (err) throw err
    console.log('MySQL connected')
})

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

///////////////////////////////////// PAGES ////////////////////////////////////////

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



// adding a new box
app.get('/newBox', (req, resp) => {
    resp.render('pages/newBox')
})

// when a new box is created insert it in the 'box' table
app.post('/newBoxResult', (req, resp) => {
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
})



// creating a note
app.get('/newNote', (req, resp) => {
    resp.sendFile(path.join(__dirname + '/pages/newNote'))
})

// when a new Note is added check the boxCode and link it to a corresponding box
app.post('/newNoteResult', (req, resp) => {
    // find a box with specified boxCode
    let findBoxQuery = `SELECT boxId FROM box WHERE boxCode = '${req.body.boxCode}'`
    db.query(findBoxQuery, (err, boxId) => {
        if (err) {
            // TODO:
            //      - handle error: something went wrong
            throw err
        } else {
            if (boxId == []) {
                // TODO:
                //      - handle error: a box with this boxCode doesn't exist
                return
            }
            boxId = boxId[0].boxId

            // add a new note record related to the box found
            let query = `INSERT INTO note(boxId, message) VALUES (${boxId}, '${req.body.message}')`
            db.query(query, (err, result) => {
                if (err) {
                    // TODO:
                    //      - handle error: something went wrong
                    throw err
                } else {
                    // display the result page after a box is added
                    resp.sendFile(path.join(__dirname + '/pages/newNoteResult'))
                }
            })
        }
    })
})

// creating a note
app.get('/openBox', (req, resp) => {
    resp.sendFile(path.join(__dirname + '/pages/openBox'))
})

// when a box is opened check the time and display all the notes inside the box
app.post('/openBoxResult', (req, resp) => {
    // TODO: 
    //      - query = `SELECT message FROM note, box WHERE box.boxCode = ${req.body.boxCode} and note.boxId = box.boxId`
    //      - if there is no box with the specified boxCode inform the user (on the openBox page)
    //      - if the openTime is in the future, then inform the user (on the openBoxResult page)
    db.query(query, (err, result) => {
        if (err) {
            throw err
        } else {
            // display the result page after a box is added
            resp.sendFile(path.join(__dirname + '/pages/openBoxResult'))
        }
    })
})




app.listen('8000', () => {
    console.log('Server started on port 8000')
})