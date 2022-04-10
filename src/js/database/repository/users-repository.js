class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE users`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id TEXT,
          created_at TEXT,
          updated_at TEXT,
          UNIQUE(player_id)
      )`
        return this.dao.run(sql)
    }

    connectUser(
        playerID,
    ) {
        return this.dao.run(
            'INSERT or IGNORE INTO users (player_id, created_at, updated_at) VALUES (?, ?, ?)',
            [playerID, Date.now(), Date.now()]
        )
    }
}

module.exports = {UsersRepository}