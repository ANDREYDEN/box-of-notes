const axios = require('axios')

const { generateBoxCode, formatDate, getEpochMs } = require('./functions')

const instance = axios.create({
    baseURL: '/api',
    proxy: {
        host: process.env.HOST,
        port: process.env.PORT
    }
})

const getBoxByCode = boxCode => {
    return instance.get(`/boxes/${boxCode}`)
        .then(resp => resp.data ? resp.data[0] : null)
        .catch(err => { throw err })
    }
    
const getNotesFromBox = boxCode => {
    return axios.get(`/boxes/${boxCode}/notes`)
        .then(resp => resp.data)
        .catch(err => { throw err })
}

const openBoxByCode = boxCode => {
    return axios.put(`/boxes/${boxCode}`)
        .then(resp => resp.data)
        .catch(err => { throw err })
}

const createBox = (openTime, details) => {
    const BOX_CODE = generateBoxCode()
    return instance.post('/boxes', {
        boxCode: BOX_CODE,
        openTime: openTime,
        details: details
    })
        .then(resp => BOX_CODE)
        .catch(err => { throw err })
}

const createNote = (boxCode, message) => {
    return getBoxByCode(boxCode)
        .then(box => {
            if (!box) throw new Error('Invalid box code')
            if (box.openTime <= getEpochMs()) {
                throw new Error('Box already opened')
            }
            return instance.post(`/notes`, {
                boxCode: boxCode,
                message: message
            })
                .then(resp => resp.data)
                .catch(err => { throw err })
        })
}

module.exports = {
    getBoxByCode: getBoxByCode,
    getNotesFromBox: getNotesFromBox,
    openBoxByCode: openBoxByCode,
    createBox: createBox,
    createNote: createNote
}