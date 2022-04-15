class RiverRaceRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE river_races`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS river_races (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tag TEXT,
          day INTEGER,
          week INTEGER,
          month INTEGER,
          year INTEGER,
          created_at TEXT,
          updated_at TEXT,
          boat_attacks INTEGER,
          decks_used INTEGER,
          decks_used_today INTEGER,
          repair_points INTEGER,
          fame INTEGER,
          UNIQUE(tag, day, week, month, year)
      )`
        return this.dao.run(sql)
    }

    create(
        tag, day, week, month, year, boatAttacks, decksUsed, decksUsedToday, repairPoints,
        fame
    ) {
        this.dao.run(
            `INSERT or IGNORE INTO river_races (tag, day, week, month, year, boat_attacks, 
            decks_used, decks_used_today, repair_points, fame, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tag, day, week, month, year, boatAttacks, decksUsed, decksUsedToday, repairPoints, fame, Date.now(), Date.now()]
        )
    }

    update(
        tag, day, week, month, year, boatAttacks, decksUsed, decksUsedToday, repairPoints,
        fame
    ) {
        this.dao.run(
            `UPDATE river_races SET boat_attacks=?, decks_used=?, decks_used_today=?, 
             repair_points=?, fame=?, updated_at=? 
             WHERE tag=? AND day=? AND week=? AND month=? AND year=?`,
            [boatAttacks, decksUsed, decksUsedToday, repairPoints, fame, Date.now(), tag, day, week, month, year]
        )
    }

    async entryExists(tag, day, week, month, year) {
        return this.dao.get(
            `SELECT r.boat_attacks as boatAttacks, r.decks_used AS decksUsed, 
             r.decks_used_today AS decksUsedToday, r.repair_points AS repairPoints,
             r.fame, r.tag, r.day, r.week, r.month, r.year
             FROM river_races r
             WHERE r.tag=? AND r.day=? AND r.week=? AND r.month=? AND r.year=?`,
            [tag, day, week, month, year]
        )
    }
}

module.exports = {RiverRaceRepository}