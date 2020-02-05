const express = require('express')
const mysql = require('mysql')

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

const router = express.Router()

// create a new box
router.post('/boxes', (req, resp) => {
    const query = `INSERT INTO box(boxCode, openTime, details) VALUES (?, ?, ?)`
    db.query(query, [req.body.boxCode, req.body.openTime, req.body.details], (err, res) => {
        if (err) throw err
        resp.send(true)
    })
})

router.route('/boxes/:boxCode')
    // get box by box code
    .get((req, resp) => {
        const query = `SELECT * FROM box WHERE boxCode = ?`
        db.query(query, [req.params.boxCode], (err, box) => {
            if (err) throw err
            resp.send(box)
        })
    })
    // open box by box code
    .put((req, resp) => {
        const query = `UPDATE box SET opened = 1 WHERE boxCode = ?`
        db.query(query, [req.params.boxCode], (err, res) => {
            if (err) throw err
            resp.send(true)
        })
    })

// get notes from box 
router.get('/boxes/:boxCode/notes', (req, resp) => {
    const query = `SELECT * FROM note WHERE note.boxCode = ?`
    db.query(query, [req.params.boxCode], (err, notes) => {
        if (err) throw err
        resp.send(notes)
    })
})

// create note
router.post('/notes', (req,resp) => {
    const query = `INSERT INTO note(boxCode, message) VALUES (?, ?)`
    db.query(query, [req.body.boxCode, req.body.message], (err, res) => {
        if (err) throw err
        resp.send(true)
    })
})



module.exports = router