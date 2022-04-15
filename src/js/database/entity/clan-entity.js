const {clanModel} = require("../model/clan");

class ClanEntity {

    constructor() {
        this.tableName = 'clans'
        this.tableModel = clanModel
        this.options = {
            unique: [
                clanModel.tag
            ]
        }
    }

}

module.exports = ClanEntity