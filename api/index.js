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

router.get('/box/:code', (req, resp) => {
    const query = `SELECT * FROM box WHERE boxCode = '${req.params.code}'`
    db.query(query, (err, box) => {
        if (err) throw err
        resp.send(box)
    })
})

router.get('/notes/:boxId', (req, resp) => {
    const query = `SELECT message FROM note WHERE note.boxId = '${req.params.boxId}'`
    db.query(query, (err, notes) => {
        if (err) throw err
        resp.send(notes)
    })
})

module.exports = router