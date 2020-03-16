'use strict'
const { getEpochMs } = require('../src/functions')

class Box {
    constructor({ boxCode, openTime, details }) {
        this.boxCode = boxCode
        this.openTime = openTime
        this.details = details
    }

    get formatedDate() {
        return new Date(this.openTime).toString().split(' ').slice(1, 5).join(' ')
    }

    isOpened() {
        return getEpochMs() > this.openTime
    }
}

module.exports = Box