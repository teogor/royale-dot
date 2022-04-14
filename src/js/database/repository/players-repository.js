class PlayersRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE players`)
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT,
          updated_at TEXT,
          tag TEXT,
          name TEXT,
          clan_tag TEXT,
          exp_level INTEGER,
          trophies INTEGER,
          best_trophies INTEGER,
          wins INTEGER,
          losses INTEGER,
          battle_count INTEGER,
          three_crown_wins INTEGER,
          challenge_cards_won INTEGER,
          challenge_max_wins INTEGER,
          tournament_cards_won INTEGER,
          tournament_battle_count INTEGER,
          role INTEGER,
          donations INTEGER,
          donations_received INTEGER,
          total_donations INTEGER,
          war_day_wins INTEGER,
          clan_cards_collected INTEGER,
          star_points INTEGER,
          exp_points INTEGER,
          clan_rank INTEGER,
          UNIQUE(tag)
      )`
        return this.dao.run(sql)
    }

    connectPlayer(
        tag, name, clan_tag, exp_level, trophies, best_trophies, wins, losses,
        battle_count, three_crown_wins, challenge_cards_won, challenge_max_wins, tournament_cards_won,
        tournament_battle_count, role, donations, donations_received, total_donations, war_day_wins,
        clan_cards_collected, star_points, exp_points, clan_rank
    ) {
        return this.dao.run(
            'INSERT or IGNORE INTO players (tag, name, clan_tag, exp_level, trophies, best_trophies, wins, losses, ' +
            'battle_count, three_crown_wins, challenge_cards_won, challenge_max_wins, tournament_cards_won, ' +
            'tournament_battle_count, role, donations, donations_received, total_donations, war_day_wins, ' +
            'clan_cards_collected, star_points, exp_points, clan_rank, created_at, updated_at)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                tag, name, clan_tag, exp_level, trophies, best_trophies, wins, losses,
                battle_count, three_crown_wins, challenge_cards_won, challenge_max_wins, tournament_cards_won,
                tournament_battle_count, role, donations, donations_received, total_donations, war_day_wins,
                clan_cards_collected, star_points, exp_points, clan_rank, Date.now(), Date.now()
            ]
        )
    }

    updateClanMember(
        name,
        role,
        exp_level,
        trophies,
        clan_rank,
        donations,
        donations_received,
        tag
    ) {
        this.dao.run(
            'UPDATE players SET name=?, role=?, exp_level=?, trophies=?, clan_rank=?, donations=?  WHERE tag=?',
            [
                name, role, exp_level, trophies, clan_rank, donations, tag
            ]
        )
    }

    exists(tag) {
        return this.dao.get(
            'SELECT id FROM players WHERE tag = ?',
            [tag]
        )
    }

    async getPlayer(player_id) {
        return this.dao.get(
            `SELECT * FROM players WHERE player_id = ?`,
            [player_id]
        )
    }

    async getPlayerByTag(tag) {
        return this.dao.get(
            `SELECT * FROM players WHERE tag = ?`,
            [tag]
        )
    }

    async getForClan(clanTag, pattern) {
        return this.dao.all(
            `SELECT p.tag, p.name, p.exp_level AS expLevel, p.trophies
            FROM players p
            WHERE p.clan_tag = ? AND p.name LIKE ? OR p.clan_tag = ? AND p.tag LIKE ?`,
            [clanTag, pattern, clanTag, pattern]
        )
    }

    async removeFromClan(tag) {
        this.dao.run(
            `UPDATE players 
             SET clan_tag=NULL 
             WHERE tag=?`,
            [tag]
        )
    }

    async addToClan(tag, clanTag) {
        this.dao.run(
            `UPDATE players 
             SET clan_tag=? 
             WHERE tag=?`,
            [clanTag, tag]
        )
    }
}

module.exports = {PlayersRepository}