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
    clanRank: {
        name: 'clan_rank',
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
}

class Player {
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
        this.tournamentBattleCount = 0
        this.donations = 0
        this.donationsReceived = 0
        this.totalDonations = 0
        this.warDayWins = 0
        this.clanCardsCollected = 0
        this.starPoints = 0
        this.expPoints = 0
        this.clanRank = 0
        this.lastSeen = ""
    }
}

module.exports = {
    Player,
    playerModel
}