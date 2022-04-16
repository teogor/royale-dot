const royaleDotDB = require("../royale-dot-database");

class PlayerRepository {

    constructor() {

    }

    insertPlayer(player) {
        royaleDotDB.playerDAO.insertPlayer(player)
    }

    insertFromMember(player) {
        royaleDotDB.playerDAO.insertFromMember(player)
    }

    async getByClan(tag) {
        return royaleDotDB.playerDAO.getByClan(tag)
    }

    async getRecommended(tag, keyword) {
        return royaleDotDB.playerDAO.getRecommended(tag, keyword)
    }

}

const playerRepository = new PlayerRepository()
module.exports = playerRepository