const axios = require('axios')

const PROXY = {
    host: process.env.HOST,
    port: process.env.PORT
}

const getBoxByCode = boxCode => {
    return axios.get(`/api/box/${boxCode}`, { proxy: PROXY })
        .then(resp => resp.data ? resp.data[0] : null)
        .catch(err => { console.log(err.message); })
    }
    
const getNotesFromBox = boxCode => {
    return getBoxByCode(boxCode).then(box => {
        return axios.get(`/api/notes/${box.boxId}`, { proxy: PROXY })
            .then(resp => resp.data)
            .catch(err => { throw err })
    })
}

module.exports = {
    getBoxByCode: getBoxByCode,
    getNotesFromBox: getNotesFromBox
}