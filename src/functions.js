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
const formatDate = date => date.toString().split(' ').slice(1, 5).join(' ')

// changes the 'opened' property to 1 in the db record with the specified (identifier, value) pair
const openBox = ({ db, identifier, value }) => {
    if (typeof (value) == 'string') value = `'${value}'`

    let query = `UPDATE box SET opened = 1 WHERE ${identifier} = ${value}`
    console.log(`Query: ${query}`)
    db.query(query, (err, result) => {
        if (err) throw err
    })
}

module.exports = {
    generateBoxCode: generateBoxCode,
    formatDate: formatDate,
    openBox: openBox
}