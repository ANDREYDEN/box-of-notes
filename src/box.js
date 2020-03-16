const { getEpochMs } = require('./functions')

class Box {
    constructor(box) {
        Object.keys(box).forEach(param => this[param] = box[param]);
    }

    get formatedDate() {
        return new Date(this.openTime).toString().split(' ').slice(1, 5).join(' ')
    }

    isOpened() {
        return getEpochMs() > this.openTime
    }
}

module.exports = Box