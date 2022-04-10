class ClansRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE clans`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS clans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT,
          updated_at TEXT,
          tag TEXT,
          name TEXT,
          type TEXT,
          description TEXT,
          badge_id INTEGER,
          clan_score INTEGER,
          clan_war_trophies INTEGER,
          required_trophies INTEGER,
          donations_per_week INTEGER,
          members INTEGER,
          location_name TEXT,
          location_is_country BIT,
          UNIQUE(tag)
      )`
        return this.dao.run(sql)
    }

    connectClan(
        tag, name, type, description, badge_id, clan_score, clan_war_trophies, required_trophies,
        donations_per_week, members, location_name, location_is_country
    ) {
        return this.dao.run(
            'INSERT or IGNORE INTO clans (tag, name, type, description, badge_id, clan_score, clan_war_trophies,' +
            'required_trophies, donations_per_week, members, location_name, location_is_country, created_at, updated_at)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                tag, name, type, description, badge_id, clan_score, clan_war_trophies, required_trophies,
                donations_per_week, members, location_name, location_is_country, Date.now(), Date.now()
            ]
        )
    }

    updateClan(
        type, description, badge_id, clan_score, clan_war_trophies, required_trophies,
        donations_per_week, members, location_name, location_is_country, tag
    ) {
        this.dao.run(
            'UPDATE clans SET type=?, description=?, badge_id=?, clan_score=?, clan_war_trophies=?, ' +
            'required_trophies=?, donations_per_week=?, members=?, location_name=?, location_is_country=?, updated_at=? WHERE ' +
            'tag=?',
            [
                type, description, badge_id, clan_score, clan_war_trophies, required_trophies,
                donations_per_week, members, location_name, location_is_country, Date.now(), tag
            ]
        )
    }

    exists(tag) {
        return this.dao.get(
            'SELECT id FROM clans WHERE tag = ?',
            [tag]
        )
    }

    getDetails(tag) {
        return this.dao.get(
            'SELECT name, description, badge_id FROM clans WHERE tag = ?',
            [tag]
        )
    }

    getFullDetails(tag) {
        return this.dao.get(
            'SELECT tag, name, description, badge_id, clan_score, clan_war_trophies, required_trophies, donations_per_week, ' +
            'members, type, location_name, location_is_country FROM clans WHERE tag = ?',
            [tag]
        )
    }

    getRecommendedClans(pattern) {
        // return this.dao.all(
        //     'SELECT tag, name, description, badge_id FROM clans WHERE name LIKE \'%s%\''
        // )
        return this.dao.all(
            'SELECT tag, name, description, badge_id FROM clans WHERE name LIKE ? OR tag LIKE ?',
            [pattern, pattern]
        )
    }
}

module.exports = {ClansRepository}