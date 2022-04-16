const {toUppercaseWords} = require("../../utils/functions");

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
        name: 'type',
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
    locationName: {
        name: 'location_name',
        type: 'TEXT',
    },
    locationIsCountry: {
        name: 'location_is_country',
        type: 'BIT',
    },
}

class Clan {

    /**
     * @param clanDB
     */
    static fromDatabaseModel(clanDB) {
        const clan = new Clan()
        Object.entries(clanDB).forEach(([key, value]) => {
            clan[toUppercaseWords(key)] = value
        })
        clan.locationIsCountry = clan.locationIsCountry === 1
        return clan
    }

    /**
     * @param clanAPI
     */
    static fromAPIModel(clanAPI) {
        const clan = new Clan()
        clan.tag = clanAPI.tag
        clan.name = clanAPI.name
        switch (clanAPI.type) {
            case 'open':
                clan.type = 0
                break
            case 'inviteOnly':
                clan.type = 1
                break
            case 'closed':
                clan.type = 2
                break
        }
        clan.description = clanAPI.description
        clan.badgeId = clanAPI.badgeId
        clan.clanScore = clanAPI.clanScore
        clan.clanWarTrophies = clanAPI.clanWarTrophies
        clan.requiredTrophies = clanAPI.requiredTrophies
        clan.donationsPerWeek = clanAPI.donationsPerWeek
        clan.members = clanAPI.members
        clan.locationName = clanAPI.locationName
        clan.locationIsCountry = clanAPI.locationIsCountry
        return clan
    }

    constructor() {
        this.id = 0
        this.createdAt = ''
        this.updatedAt = ''
        this.tag = ''
        this.name = ""
        this.type = 0
        this.description = ""
        this.badgeId = 0
        this.clanScore = 0
        this.clanWarTrophies = 0
        this.requiredTrophies = 0
        this.donationsPerWeek = 0
        this.members = 0
        this.locationName = ""
        this.locationIsCountry = false
    }
}

module.exports = {
    Clan,
    clanModel
}