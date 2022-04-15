const royaleDotDB = require("../royale-dot-database");

class ParticipantRepository {

    constructor() {

    }

    insertParticipant(participant) {
        royaleDotDB.participantDAO.insertParticipant(participant)
    }

}

const participantRepository = new ParticipantRepository()
module.exports = participantRepository