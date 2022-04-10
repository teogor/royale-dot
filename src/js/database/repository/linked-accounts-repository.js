class LinkedAccountsRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE linked_accounts`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS linked_accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id TEXT,
          player_tag TEXT,
          linked_at TEXT,
          UNIQUE(player_id, player_tag)
      )`
        return this.dao.run(sql)
    }

    linkPlayer(
        playerID,
        playerTag,
    ) {
        return this.dao.run(
            'INSERT or IGNORE INTO linked_accounts (player_id, player_tag, linked_at) VALUES (?, ?, ?)',
            [playerID, playerTag, Date.now()])
    }

    unlinkPlayer(
        playerID,
        playerTag,
    ) {
        return this.dao.run(
            `DELETE FROM linked_accounts WHERE AND player_id = ? AND royale_tag = ?`,
            [playerID, playerTag]
        )
    }

    isLinked(
        guildID,
        playerID,
        playerTag,
    ) {
        return this.dao.get(
            `SELECT player_id FROM linked_accounts WHERE guild_id = ? AND player_id = ? AND royale_tag = ?`,
            [guildID, playerID, playerTag]
        )
    }
}

module.exports = {LinkedAccountsRepository}