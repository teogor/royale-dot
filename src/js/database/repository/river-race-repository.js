const royaleDotDB = require("../royale-dot-database");

class RiverRaceRepository {

    constructor() {

    }

    insertRiverRace(riverRace) {
        royaleDotDB.riverRaceDAO.insertRiverRace(riverRace)
    }

    insertCurrentRiverRace(riverRace) {
        royaleDotDB.riverRaceDAO.insertCurrentRiverRace(riverRace)
    }

}

const riverRaceRepository = new RiverRaceRepository()
module.exports = riverRaceRepository