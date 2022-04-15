const royaleDotDB = require("../royale-dot-database");

class ClanRepository {

    constructor() {

    }

    insertClan(clan) {
        royaleDotDB.clanDAO.insertClan(clan)
    }

}

const clanRepository = new ClanRepository()
module.exports = clanRepository