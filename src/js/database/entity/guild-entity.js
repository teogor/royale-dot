const {guildModel} = require("../model/guild");

class GuildEntity {

    constructor() {
        this.tableName = 'guilds'
        this.tableModel = guildModel
        this.options = {
            unique: [
                guildModel.guildId
            ]
        }
    }

}

module.exports = GuildEntity