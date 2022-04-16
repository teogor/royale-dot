const {toUppercaseWords} = require("../../utils/functions");
const playerModel = {
    // id
    id: {
        name: 'id',
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true
    },
    // timestamps
    createdAt: {
        name: 'created_at',
        type: 'TEXT',
    },
    updatedAt: {
        name: 'updated_at',
        type: 'TEXT',
    },
    // data
    tag: {
        name: 'tag',
        type: 'TEXT',
    },
    name: {
        name: 'name',
        type: 'TEXT',
    },
    clanTag: {
        name: 'clan_tag',
        type: 'TEXT',
    },
    clanRole: {
        name: 'clan_role',
        type: 'INTEGER',
    },
    clanRank: {
        name: 'clan_rank',
        type: 'INTEGER',
    },
    expLevel: {
        name: 'exp_level',
        type: 'INTEGER',
    },
    trophies: {
        name: 'trophies',
        type: 'INTEGER',
    },
    bestTrophies: {
        name: 'best_trophies',
        type: 'INTEGER',
    },
    wins: {
        name: 'wins',
        type: 'INTEGER',
    },
    losses: {
        name: 'losses',
        type: 'INTEGER',
    },
    battleCount: {
        name: 'battle_count',
        type: 'INTEGER',
    },
    threeCrownWins: {
        name: 'three_crown_wins',
        type: 'INTEGER',
    },
    challengeCardsWon: {
        name: 'challenge_cards_won',
        type: 'INTEGER',
    },
    challengeMaxWins: {
        name: 'challenge_max_wins',
        type: 'INTEGER',
    },
    tournamentCardsWon: {
        name: 'tournament_cards_won',
        type: 'INTEGER',
    },
    tournamentBattleCount: {
        name: 'tournament_battle_count',
        type: 'INTEGER',
    },
    donations: {
        name: 'donations',
        type: 'INTEGER',
    },
    donationsReceived: {
        name: 'donations_received',
        type: 'INTEGER',
    },
    totalDonations: {
        name: 'total_donations',
        type: 'INTEGER',
    },
    warDayWins: {
        name: 'war_day_wins',
        type: 'INTEGER',
    },
    clanCardsCollected: {
        name: 'clan_cards_collected',
        type: 'INTEGER',
    },
    starPoints: {
        name: 'star_points',
        type: 'INTEGER',
    },
    expPoints: {
        name: 'exp_points',
        type: 'INTEGER',
    },
    lastSeen: {
        name: 'last_seen',
        type: 'TEXT',
    },
    arenaId: {
        name: 'arena_id',
        type: 'INTEGER',
    },
    leagueCurrentSeasonTrophies: {
        name: 'league_current_season_trophies',
        type: 'INTEGER',
    },
    leagueCurrentSeasonBestTrophies: {
        name: 'league_current_season_best_trophies',
        type: 'INTEGER',
    },
    leaguePreviousSeasonTrophies: {
        name: 'league_previous_season_trophies',
        type: 'INTEGER',
    },
    leaguePreviousSeasonBestTrophies: {
        name: 'league_previous_season_best_trophies',
        type: 'INTEGER',
    },
    leaguePreviousSeasonId: {
        name: 'league_previous_season_id',
        type: 'TEXT',
    },
    leagueBestSeasonTrophies: {
        name: 'league_best_season_trophies',
        type: 'INTEGER',
    },
    leagueBestSeasonId: {
        name: 'league_best_season_id',
        type: 'TEXT',
    },
}

class Player {

    /**
     * @param playerDB
     */
    static fromDatabaseModel(playerDB) {
        const player = new Player()
        Object.entries(playerDB).forEach(([key, value]) => {
            player[toUppercaseWords(key)] = value
        })
        return player
    }

    /**
     * @param playerAPI
     */
    static fromAPIMemberModel(playerAPI) {
        const player = new Player()
        player.tag = playerAPI.tag
        player.clanTag = playerAPI.clan.tag
        player.name = playerAPI.name
        player.expLevel = playerAPI.expLevel
        player.trophies = playerAPI.trophies
        player.clanRank = playerAPI.clanRank
        player.donations = playerAPI.donations
        player.donationsReceived = playerAPI.donationsReceived
        player.arenaId = playerAPI.arena.id
        player.lastSeen = playerAPI.lastSeen.getTime()
        player.clanRole = playerAPI.role.type
        return player
    }

    static fromAPIModel(playerAPI) {
        const player = new Player()
        player.tag = playerAPI.tag
        player.name = playerAPI.name
        player.expLevel = playerAPI.expLevel
        player.trophies = playerAPI.trophies
        player.bestTrophies = playerAPI.bestTrophies
        player.wins = playerAPI.wins
        player.losses = playerAPI.losses
        player.battleCount = playerAPI.battleCount
        player.threeCrownWins = playerAPI.threeCrownWins
        player.challengeCardsWon = playerAPI.challengeCardsWon
        player.challengeMaxWins = playerAPI.challengeMaxWins
        player.tournamentCardsWon = playerAPI.tournamentCardsWon
        player.tournamentBattleCount = playerAPI.tournamentBattleCount
        player.clanRole = playerAPI.role.type
        player.donations = playerAPI.donations
        player.donationsReceived = playerAPI.donationsReceived
        player.totalDonations = playerAPI.totalDonations
        player.warDayWins = playerAPI.warDayWins
        player.starPoints = playerAPI.starPoints
        player.expPoints = playerAPI.expPoints
        player.clanTag = playerAPI.clanTag
        player.arenaId = playerAPI.arena.id
        const league = playerAPI.leagueStatistics
        if (league !== undefined) {
            if (league.currentSeason !== undefined) {
                player.leagueCurrentSeasonTrophies = league.currentSeason.trophies
                player.leagueCurrentSeasonBestTrophies = league.currentSeason.bestTrophies
            }
            if (league.previousSeason !== undefined) {
                player.leaguePreviousSeasonTrophies = league.previousSeason.trophies
                player.leaguePreviousSeasonBestTrophies = league.previousSeason.bestTrophies
                player.leaguePreviousSeasonId = league.previousSeason.id
            }
            if (league.bestSeason !== undefined) {
                player.leagueBestSeasonTrophies = league.bestSeason.trophies
                player.leagueBestSeasonId = league.bestSeason.id
            }
        }
        return player
    }

    constructor() {
        this.id = 0
        this.createdAt = ''
        this.updatedAt = ''
        this.tag = ''
        this.name = ''
        this.clanTag = ''
        this.expLevel = 0
        this.trophies = 0
        this.bestTrophies = 0
        this.wins = 0
        this.losses = 0
        this.battleCount = 0
        this.threeCrownWins = 0
        this.challengeCardsWon = 0
        this.challengeMaxWins = 0
        this.tournamentCardsWon = 0
        this.tournamentBattleCount = 0
        this.donations = 0
        this.donationsReceived = 0
        this.totalDonations = 0
        this.warDayWins = 0
        this.clanCardsCollected = 0
        this.starPoints = 0
        this.expPoints = 0
        this.clanRank = 0
        this.clanRole = 0
        this.lastSeen = ""
        this.donationsPerWeek = 0
        this.arenaId = 0
        this.leagueCurrentSeasonTrophies = 0
        this.leagueCurrentSeasonBestTrophies = 0
        this.leaguePreviousSeasonTrophies = 0
        this.leaguePreviousSeasonBestTrophies = 0
        this.leaguePreviousSeasonId = 0
        this.leagueBestSeasonTrophies = 0
        this.leagueBestSeasonId = 0
    }

    get isLinked() {
        return this.tag !== null
    }
}

module.exports = {
    Player,
    playerModel
}