class RiverRaceDAO {

    constructor(db) {
        this.db = db
    }

    insertRiverRace(riverRace) {
        const {
            tag,
            day,
            week,
            month,
            year,
            pointsEarned,
            progressStartOfDay,
            progressEndOfDay,
            endOfDayRank,
            progressEarned,
            numOfDefensesRemaining,
            progressEarnedFromDefenses,
        } = riverRace
        const insertColumns = [
            'tag',
            'day',
            'week',
            'month',
            'year',
            'points_earned',
            'progress_start_of_day',
            'progress_end_of_day',
            'end_of_day_rank',
            'progress_earned',
            'num_of_defenses_remaining',
            'progress_earned_from_defenses',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'day=?',
            'week=?',
            'month=?',
            'year=?',
            'points_earned=?',
            'progress_start_of_day=?',
            'progress_end_of_day=?',
            'end_of_day_rank=?',
            'progress_earned=?',
            'num_of_defenses_remaining=?',
            'progress_earned_from_defenses=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            day,
            week,
            month,
            year,
            pointsEarned,
            progressStartOfDay,
            progressEndOfDay,
            endOfDayRank,
            progressEarned,
            numOfDefensesRemaining,
            progressEarnedFromDefenses,
            Date.now(),
            Date.now(),
            day,
            week,
            month,
            year,
            pointsEarned,
            progressStartOfDay,
            progressEndOfDay,
            endOfDayRank,
            progressEarned,
            numOfDefensesRemaining,
            progressEarnedFromDefenses,
            Date.now(),
            tag
        ]

        const sqlInsert = `INSERT INTO river_races(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
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

    insertCurrentRiverRace(riverRace) {
        const {
            tag,
            day,
            week,
            month,
            year,
            fame,
            participants,
            repairPoints,
            decksUsed,
            decksUsedToday,
            boatAttacks,
        } = riverRace
        const insertColumns = [
            'tag',
            'day',
            'week',
            'month',
            'year',
            'fame',
            'participants',
            'repair_points',
            'decks_used',
            'decks_used_today',
            'boat_attacks',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'day=?',
            'week=?',
            'month=?',
            'year=?',
            'fame=?',
            'participants=?',
            'repair_points=?',
            'decks_used=?',
            'decks_used_today=?',
            'boat_attacks=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            day,
            week,
            month,
            year,
            fame,
            participants,
            repairPoints,
            decksUsed,
            decksUsedToday,
            boatAttacks,
            Date.now(),
            Date.now(),
            day,
            week,
            month,
            year,
            fame,
            participants,
            repairPoints,
            decksUsed,
            decksUsedToday,
            boatAttacks,
            Date.now(),
            tag
        ]

        const sqlInsert = `INSERT INTO river_races(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
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

}

module.exports = RiverRaceDAO