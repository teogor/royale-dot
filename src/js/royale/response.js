class Response {
    constructor(data) {
        this.data = data.items || data
    }
}

module.exports = Response