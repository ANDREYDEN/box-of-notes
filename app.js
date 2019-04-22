const express = require('express')
const mysql = require('mysql')
const path = require('path')
const bodyParser = require("body-parser");


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

app.listen('8000', () => {
    console.log('Server started')
})

// creating a DB
app.get('/create-database/:name', (req, resp) => {
    let query = `CREATE DATABASE ${req.params.name}`
    db.query(query, (err, result) => {
        if (err) throw err
        console.log(result)
        resp.send(`Database ${req.params.name} created!`)
    })
})

// render pages

app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/newBox', (req, resp) => {
    resp.sendFile(path.join(__dirname + '/pages/newBox.html'))
})

// when a new box is created insert it in the 'box' table
app.post('/newBoxResult', (req, resp) => {
    //resp.send(`Time: ${req.body.time}, Details: ${req.body.details}`)
    let query = `INSERT INTO box(openTime, details) VALUES ('${req.body.time}', '${req.body.details}')`
    db.query(query, (err, result) => {
        if (err) throw err
        console.log(result)
    })
})

// respond to the new box submission
app.get('/newBoxResult', (req, resp) => {
    resp.sendFile(path.join(__dirname + '/pages/newBoxResult.html'))
})