const royaleDotDB = require("../royale-dot-database");

class UserRepository {

    constructor() {

    }

    insertUser(user) {
        royaleDotDB.userDAO.insertUser(user)
    }

}

const userRepository = new UserRepository()
module.exports = userRepository