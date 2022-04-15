const royaleDotDB = require("../royale-dot-database");

class GuildRepository {

    constructor() {

    }

    insertGuild(guild) {
        royaleDotDB.guildDAO.insertGuild(guild)
    }

}

const guildRepository = new GuildRepository()
module.exports = guildRepository