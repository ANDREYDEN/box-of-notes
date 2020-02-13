const axios = require('axios')

const { generateBoxCode } = require('./functions')
const Box = require('./box')

class Api {
    constructor() {
        this.instance = axios.create({
            baseURL: '/api',
            proxy: {
                host: process.env.HOST,
                port: process.env.PORT
            }
        })
    }
    getBoxByCode(boxCode) {
        return this.instance.get(`/boxes/${boxCode}`)
            .then(resp => resp.data ? new Box(resp.data[0]) : null)
            .catch(err => { throw err })
        }
        
    getNotesFromBox(boxCode) {
        return this.instance.get(`/boxes/${boxCode}/notes`)
            .then(resp => resp.data)
            .catch(err => { throw err })
    }
    
    createBox(openTime, details) {
        const BOX_CODE = generateBoxCode()
        return this.instance.post('/boxes', {
            boxCode: BOX_CODE,
            openTime: openTime,
            details: details
        })
            .then(resp => BOX_CODE) 
            .catch(err => { throw err })
    }
    
    createNote(boxCode, message) {
        return this.getBoxByCode(boxCode)
            .then(box => {
                if (!box) throw new Error('Invalid box code')
                if (box.isOpened()) {
                    throw new Error('Box already opened')
                }
                return this.instance.post(`/notes`, {
                    boxCode: boxCode,
                    message: message
                })
                    .then(resp => resp.data)
                    .catch(err => { throw err })
            })
    }
}

module.exports = Api