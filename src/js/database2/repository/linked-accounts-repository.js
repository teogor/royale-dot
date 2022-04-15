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

    linkPlayer(playerID, playerTag) {
        return this.dao.run(
            'INSERT or IGNORE INTO linked_accounts (player_id, player_tag, linked_at) VALUES (?, ?, ?)',
            [playerID, playerTag, Date.now()])
    }

    unlinkPlayer(playerID, playerTag) {
        return this.dao.run(
            `DELETE FROM linked_accounts WHERE player_id = ? AND player_tag = ?`,
            [playerID, playerTag]
        )
    }

    isLinked(playerID, playerTag) {
        return this.dao.get(
            `SELECT COUNT(la.id) as linked_accounts,
            (SELECT COUNT(id) FROM linked_accounts WHERE linked_accounts.player_tag = ?) as tags,
            p2.tag as linkedTag, p2.name as linkedName, p.tag as tag, p.name as name
            FROM linked_accounts la
            LEFT JOIN players p on p.tag = ?
            LEFT JOIN players p2 on p2.tag = la.player_tag
            WHERE la.player_id = ?`,
            [playerTag, playerTag, playerID]
        )
    }

    getLinkedData(playerTag) {
        return this.dao.get(
            `SELECT la.player_id, la.player_tag
             FROM linked_accounts la
             WHERE la.player_tag = ?`,
            [playerTag]
        )
    }
}

module.exports = {LinkedAccountsRepository}