const royaleDotDB = require("../royale-dot-database");

class UserRepository {

    constructor() {

    }

    insertUser(user) {
        royaleDotDB.userDAO.insertUser(user)
    }

    updateCommands(user) {
        royaleDotDB.userDAO.updateCommands(user)
    }

    async getUser(user) {
        return royaleDotDB.userDAO.getUser(user)
    }

    async linkPlayer(user) {
        return royaleDotDB.userDAO.linkPlayer(user)
    }

    async unlinkPlayer(user) {
        return royaleDotDB.userDAO.unlinkPlayer(user)
    }

    async getLinkedPlayer(user) {
        return royaleDotDB.userDAO.getLinkedPlayer(user)
    }

    async checkPlayerLinked(user) {
        return royaleDotDB.userDAO.checkPlayerLinked(user)
    }

}

const userRepository = new UserRepository()
module.exports = userRepository