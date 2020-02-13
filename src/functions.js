const generateBoxCode = () => {
    const CODE_LEN = 6
    const ASCII_A = 65
    const ALPHA_LEN = 25
    let boxCode = ''
    for (let i = 0; i < CODE_LEN; i++) {
        let random_char_code = Math.round(Math.random() * ALPHA_LEN)
        boxCode += String.fromCharCode(ASCII_A + random_char_code)
    }
    return boxCode
}

// formats the date to 'ddd mm dd, yyyy'
const epochToDate = ms => new Date(ms).toString().split(' ').slice(1, 5).join(' ')

// get the number of milliseconds since Epoch (1970)
const getEpochMs = () => new Date().getTime()

module.exports = {
    generateBoxCode: generateBoxCode,
    epochToDate: epochToDate,
    getEpochMs: getEpochMs
}