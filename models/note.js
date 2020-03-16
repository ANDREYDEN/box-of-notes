'use strict'

class Note {
    constructor({ noteId, boxCode, message }) {
        this.noteId = noteId
        this.boxCode = boxCode
        this.message = message
    }
}

module.exports = Note