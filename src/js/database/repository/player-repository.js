const royaleDotDB = require("../royale-dot-database");

class PlayerRepository {

    constructor() {

    }

    insertPlayer(player) {
        royaleDotDB.playerDAO.insertPlayer(player)
    }

}

const playerRepository = new PlayerRepository()
module.exports = playerRepository