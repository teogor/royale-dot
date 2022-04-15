const {participantModel} = require("../model/participant");

class ParticipantEntity {

    constructor() {
        this.tableName = 'participants'
        this.tableModel = participantModel
        this.options = {
            unique: [
                participantModel.tag,
                participantModel.day,
                participantModel.week,
                participantModel.month,
                participantModel.year,
            ]
        }
    }

}

module.exports = ParticipantEntity