const royaleDotDB = require("../royale-dot-database");

class ReportDAO {

    constructor(db) {
        this.db = db
    }

    insertReport(report) {
        const {
            guildId,
            type,
            hours,
            minutes,
        } = report

        const insertColumns = [
            'guild_id',
            'type',
            'hours',
            'minutes',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?'
        const updateColumns = [
            'guild_id=?',
            'type=?',
            'hours=?',
            'minutes=?',
            'updated_at=?',
        ]
        const values = [
            guildId,
            type,
            hours,
            minutes,
            Date.now(),
            Date.now(),
            guildId,
            type,
            hours,
            minutes,
            Date.now(),
            guildId,
            type,
            hours,
            minutes,
        ]
        const sqlInsert = `INSERT INTO reports(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
        const sqlOnConflict = `ON CONFLICT(guild_id,type,hours,minutes) DO UPDATE SET ${updateColumns.join(",")}`
        const sqlTarget = `WHERE guild_id=? AND type=? AND hours=? AND minutes=?`
        const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    deleteReport(report) {
        const {
            guildId,
            type,
            hours,
            minutes,
        } = report

        const values = [
            guildId,
            type,
            hours,
            minutes
        ]

        const sql = `DELETE FROM reports WHERE guild_id=? AND type=? AND hours=? AND minutes=?`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    async getReports(report) {
        const {
            guildId,
            type,
        } = report

        const values = [
            guildId,
            type,
        ]

        const sql = `SELECT * FROM reports WHERE guild_id=? AND type=?`
        return this.db.all(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

}

module.exports = ReportDAO