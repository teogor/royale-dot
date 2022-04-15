class LinkedClansRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE linked_clans`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS linked_clans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guild_id TEXT,
          clan_tag TEXT,
          linked_at TEXT,
          UNIQUE(guild_id, clan_tag)
      )`
        return this.dao.run(sql)
    }

    linkClan(guildID, clanTag) {
        this.dao.run(
            'INSERT or IGNORE INTO linked_clans (guild_id, clan_tag, linked_at) VALUES (?, ?, ?)',
            [guildID, clanTag, Date.now()]
        )
    }

    unlinkClan(guildID, clanTag) {
        return this.dao.run(
            `DELETE FROM linked_clans WHERE guild_id = ? AND clan_tag = ?`,
            [guildID, clanTag]
        )
    }

    isLinked(guildID) {
        return this.dao.get(
            `SELECT COUNT(id) AS items, clan_tag FROM linked_clans WHERE guild_id = ?`,
            [guildID]
        )
    }

    getGuilds(clanTag) {
        return this.dao.all(
            `SELECT guild_id FROM linked_clans WHERE clan_tag = ?`,
            [clanTag]
        )
    }
}

module.exports = {LinkedClansRepository}