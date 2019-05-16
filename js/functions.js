function generateBoxCode() {
    let boxCode = ''
    for (let i = 0; i < 6; i++) {
        boxCode += String.fromCharCode(Math.round(Math.random() * 26) + 65)
    }
    return boxCode
}