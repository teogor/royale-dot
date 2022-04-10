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
          UNIQUE(royale_tag)
      )`
        return this.dao.run(sql)
    }

    addPlayer(
        player_id,
        royale_tag,
        clan_tag,
        name,
        exp_level,
        trophies,
        best_trophies,
        wins,
        losses,
        battle_count,
        three_crown_wins,
        challenge_cards_won,
        challenge_max_wins,
        tournament_cards_won,
        tournament_battle_count,
        role,
        donations,
        donations_received,
        total_donations,
        war_day_wins,
        clan_cards_collected,
        star_points,
        exp_points,
    ) {
        return this.dao.run(
            'INSERT or IGNORE INTO players (player_id, royale_tag, clan_tag, name, exp_level, trophies, best_trophies, wins, losses, battle_count, three_crown_wins, challenge_cards_won, challenge_max_wins, tournament_cards_won, tournament_battle_count, role, donations, donations_received, total_donations, war_day_wins, clan_cards_collected, star_points, exp_points, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [player_id, royale_tag, clan_tag, name, exp_level, trophies, best_trophies, wins, losses, battle_count, three_crown_wins, challenge_cards_won, challenge_max_wins, tournament_cards_won, tournament_battle_count, role, donations, donations_received, total_donations, war_day_wins, clan_cards_collected, star_points, exp_points, Date.now(), Date.now()])
    }

    async getPlayer(player_id) {
        return this.dao.get(
            `SELECT * FROM players WHERE AND player_id = ?`,
            [player_id]
        )
    }
}

module.exports = {PlayersRepository}