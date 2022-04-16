const royaleDotDB = require("../royale-dot-database");

class ParticipantRepository {

    constructor() {

    }

    insertParticipant(participant) {
        royaleDotDB.participantDAO.insertParticipant(participant)
    }

    async getParticipant(participant) {
        return royaleDotDB.participantDAO.getParticipant(participant)
    }

}

const participantRepository = new ParticipantRepository()
module.exports = participantRepository