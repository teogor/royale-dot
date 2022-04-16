const {userModel} = require("../model/user");

class UserEntity {

    constructor() {
        this.tableName = 'users'
        this.tableModel = userModel
        this.options = {
            unique: [
                userModel.userId
            ]
        }
    }

}

module.exports = UserEntity