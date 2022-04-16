const royaleDotDB = require("../royale-dot-database");

class ClanRepository {

    constructor() {

    }

    insertClan(clan) {
        royaleDotDB.clanDAO.insertClan(clan)
    }

    async getClan(tag) {
        return royaleDotDB.clanDAO.getClan(tag)
    }

    async getRecommendedClans(keyword) {
        return royaleDotDB.clanDAO.getRecommendedClans(keyword)
    }

}

const clanRepository = new ClanRepository()
module.exports = clanRepository