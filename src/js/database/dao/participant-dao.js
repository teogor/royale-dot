const {Participant} = require("../model/participant");

class ParticipantDAO {

    constructor(db) {
        this.db = db
    }

    insertParticipant(participant) {
        const {
            tag,
            day,
            week,
            month,
            year,
            fame,
            repairPoints,
            boatAttacks,
            decksUsed,
            decksUsedToday,
        } = participant
        const insertColumns = [
            'tag',
            'day',
            'week',
            'month',
            'year',
            'fame',
            'repair_points',
            'boat_attacks',
            'decks_used',
            'decks_used_today',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'day=?',
            'week=?',
            'month=?',
            'year=?',
            'fame=?',
            'repair_points=?',
            'boat_attacks=?',
            'decks_used=?',
            'decks_used_today=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            day,
            week,
            month,
            year,
            fame,
            repairPoints,
            boatAttacks,
            decksUsed,
            decksUsedToday,
            Date.now(),
            Date.now(),
            day,
            week,
            month,
            year,
            fame,
            repairPoints,
            boatAttacks,
            decksUsed,
            decksUsedToday,
            Date.now(),
            tag
        ]

        const sqlInsert = `INSERT INTO participants(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
        const sqlOnConflict = `ON CONFLICT(tag, day, week, month, year) DO UPDATE SET ${updateColumns.join(",")}`
        const sqlTarget = `WHERE tag=?`
        const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    async getParticipant(participant) {
        const {
            tag,
            day,
            week,
            month,
            year
        } = participant
        const sql = `SELECT * FROM participants 
                WHERE tag=? AND day=? AND week=? AND month=? AND year=?`
        const values = [
            tag,
            day,
            week,
            month,
            year
        ]

        const participantDB = await this.db.get(
            sql,
            values
        )

        return Participant.fromDatabaseModel(participantDB)
    }

}

module.exports = ParticipantDAO