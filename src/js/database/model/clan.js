const clanModel = {
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
    type: {
        name: 'clan_tag',
        type: 'INTEGER',
    },
    description: {
        name: 'description',
        type: 'TEXT',
    },
    badgeId: {
        name: 'badge_id',
        type: 'INTEGER',
    },
    clanScore: {
        name: 'clan_score',
        type: 'INTEGER',
    },
    clanWarTrophies: {
        name: 'clan_war_trophies',
        type: 'INTEGER',
    },
    requiredTrophies: {
        name: 'required_trophies',
        type: 'INTEGER',
    },
    donationsPerWeek: {
        name: 'donations_per_week',
        type: 'INTEGER',
    },
    members: {
        name: 'members',
        type: 'INTEGER',
    },
    location_name: {
        name: 'locationName',
        type: 'TEXT',
    },
    locationIsCountry: {
        name: 'location_is_country',
        type: 'BIT',
    },
}

class Clan {
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
    Clan,
    clanModel
}