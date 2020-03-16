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

    static handleError(err) {
        console.log('Error accessing API')
        throw err
    }

    getBoxByCode(boxCode) {
        return this.instance.get(`/boxes/${boxCode}`)
            .then(resp => {
                if (resp.status == 200) {
                    return new Box(resp.data)
                } else {
                    throw new Error(resp.data)
                }
            })
            .catch(Api.handleError)
    }

    getNotesFromBox(boxCode) {
        return this.instance.get(`/boxes/${boxCode}/notes`)
            .then(resp => resp.data)
            .catch(Api.handleError)
    }

    createBox(openTime, details) {
        const BOX_CODE = generateBoxCode()
        return this.instance.post('/boxes', {
            boxCode: BOX_CODE,
            openTime: openTime,
            details: details
        })
            .then(resp => BOX_CODE)
            .catch(Api.handleError)
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
                    .catch(Api.handleError)
            })
    }
}

module.exports = Api