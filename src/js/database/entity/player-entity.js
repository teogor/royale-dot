const {playerModel} = require("../model/player");

class PlayerEntity {

    constructor() {
        this.tableName = 'players'
        this.tableModel = playerModel
        this.options = {
            unique: [
                playerModel.tag
            ]
        }
    }

}

module.exports = PlayerEntity