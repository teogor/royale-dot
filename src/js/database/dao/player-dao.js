const {Player} = require("../model/player");

class PlayerDAO {

    constructor(db) {
        this.db = db
    }

    insertPlayer(player) {
        const {
            tag,
            name,
            expLevel,
            trophies,
            bestTrophies,
            wins,
            losses,
            battleCount,
            threeCrownWins,
            challengeCardsWon,
            challengeMaxWins,
            tournamentCardsWon,
            tournamentBattleCount,
            clanRole,
            donations,
            donationsReceived,
            totalDonations,
            warDayWins,
            clanCardsCollected,
            clanTag,
            arenaId,
            leagueCurrentSeasonTrophies,
            leagueCurrentSeasonBestTrophies,
            leaguePreviousSeasonTrophies,
            leaguePreviousSeasonBestTrophies,
            leaguePreviousSeasonId,
            leagueBestSeasonTrophies,
            leagueBestSeasonId,
            starPoints,
            expPoints
        } = player
        const insertColumns = [
            'tag',
            'name',
            'exp_level',
            'trophies',
            'best_trophies',
            'wins',
            'losses',
            'battle_count',
            'three_crown_wins',
            'challenge_cards_won',
            'challenge_max_wins',
            'tournament_cards_won',
            'tournament_battle_count',
            'clan_role',
            'donations',
            'donations_received',
            'total_donations',
            'war_day_wins',
            'clan_cards_collected',
            'clan_tag',
            'arena_id',
            'league_current_season_trophies',
            'league_current_season_best_trophies',
            'league_previous_season_trophies',
            'league_previous_season_best_trophies',
            'league_previous_season_id',
            'league_best_season_trophies',
            'league_best_season_id',
            'star_points',
            'exp_points',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'name=?',
            'exp_level=?',
            'trophies=?',
            'best_trophies=?',
            'wins=?',
            'losses=?',
            'battle_count=?',
            'three_crown_wins=?',
            'challenge_cards_won=?',
            'challenge_max_wins=?',
            'tournament_cards_won=?',
            'tournament_battle_count=?',
            'clan_role=?',
            'donations=?',
            'donations_received=?',
            'total_donations=?',
            'war_day_wins=?',
            'clan_cards_collected=?',
            'clan_tag=?',
            'arena_id=?',
            'league_current_season_trophies=?',
            'league_current_season_best_trophies=?',
            'league_previous_season_trophies=?',
            'league_previous_season_best_trophies=?',
            'league_previous_season_id=?',
            'league_best_season_trophies=?',
            'league_best_season_id=?',
            'star_points=?',
            'exp_points=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            name,
            expLevel,
            trophies,
            bestTrophies,
            wins,
            losses,
            battleCount,
            threeCrownWins,
            challengeCardsWon,
            challengeMaxWins,
            tournamentCardsWon,
            tournamentBattleCount,
            clanRole,
            donations,
            donationsReceived,
            totalDonations,
            warDayWins,
            clanCardsCollected,
            clanTag,
            arenaId,
            leagueCurrentSeasonTrophies,
            leagueCurrentSeasonBestTrophies,
            leaguePreviousSeasonTrophies,
            leaguePreviousSeasonBestTrophies,
            leaguePreviousSeasonId,
            leagueBestSeasonTrophies,
            leagueBestSeasonId,
            starPoints,
            expPoints,
            Date.now(),
            Date.now(),
            name,
            expLevel,
            trophies,
            bestTrophies,
            wins,
            losses,
            battleCount,
            threeCrownWins,
            challengeCardsWon,
            challengeMaxWins,
            tournamentCardsWon,
            tournamentBattleCount,
            clanRole,
            donations,
            donationsReceived,
            totalDonations,
            warDayWins,
            clanCardsCollected,
            clanTag,
            arenaId,
            leagueCurrentSeasonTrophies,
            leagueCurrentSeasonBestTrophies,
            leaguePreviousSeasonTrophies,
            leaguePreviousSeasonBestTrophies,
            leaguePreviousSeasonId,
            leagueBestSeasonTrophies,
            leagueBestSeasonId,
            starPoints,
            expPoints,
            Date.now(),
            tag
        ]

        const sqlInsert = `INSERT INTO players(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
        const sqlOnConflict = `ON CONFLICT(tag) DO UPDATE SET ${updateColumns.join(",")}`
        const sqlTarget = `WHERE tag=?`
        const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    insertFromMember(player) {
        const {
            tag,
            name,
            clanRole,
            lastSeen,
            expLevel,
            trophies,
            arenaId,
            clanRank,
            donations,
            donationsReceived,
            clanTag
        } = player
        const insertColumns = [
            'tag',
            'name',
            'clan_role',
            'last_seen',
            'exp_level',
            'trophies',
            'arena_id',
            'clan_rank',
            'donations',
            'donations_received',
            'clan_tag',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'name=?',
            'clan_role=?',
            'last_seen=?',
            'exp_level=?',
            'trophies=?',
            'arena_id=?',
            'clan_rank=?',
            'donations=?',
            'donations_received=?',
            'clan_tag=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            name,
            clanRole,
            lastSeen,
            expLevel,
            trophies,
            arenaId,
            clanRank,
            donations,
            donationsReceived,
            clanTag,
            Date.now(),
            Date.now(),
            name,
            clanRole,
            lastSeen,
            expLevel,
            trophies,
            arenaId,
            clanRank,
            donations,
            donationsReceived,
            clanTag,
            Date.now(),
            tag
        ]
        const sqlInsert = `INSERT INTO players(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
        const sqlOnConflict = `ON CONFLICT(tag) DO UPDATE SET ${updateColumns.join(",")}`
        const sqlTarget = `WHERE tag=?`
        const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    async getPlayer(tag) {
        const sql = `SELECT * FROM players WHERE tag=?`
        const values = [
            tag
        ]

        const playerDB = await this.db.get(
            sql,
            values
        )

        return Player.fromDatabaseModel(playerDB)
    }

    async getByClan(tag) {
        return this.db.all(
            `SELECT p.tag, p.name, p.exp_level AS expLevel, p.trophies
            FROM players p
            WHERE p.clan_tag = ?`,
            [tag]
        )
    }

    async getRecommended(tag, keyword) {
        if (keyword === undefined || keyword === null) {
            keyword = ''
        }
        keyword = `%${keyword.replace(/\s/g, '').split("").join("%")}%`
        return this.db.all(
            `SELECT p.tag, p.name, p.exp_level AS expLevel, p.trophies
            FROM players p
            WHERE p.clan_tag = ? AND p.name LIKE ? OR p.clan_tag = ? AND p.tag LIKE ?`,
            [tag, keyword, tag, keyword]
        )
    }

}

module.exports = PlayerDAO