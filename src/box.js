const { getEpochMs } = require('./functions')

class Box {
    constructor(box) {
        Object.keys(box).forEach(e => this[e] = box[e]);
    }

    isOpened() {
        return getEpochMs() > this.openTime
    }
}

module.exports = Box