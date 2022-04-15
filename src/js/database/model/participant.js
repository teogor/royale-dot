const participantModel = {
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
    day: {
        name: 'day',
        type: 'INTEGER',
    },
    week: {
        name: 'week',
        type: 'INTEGER',
    },
    month: {
        name: 'month',
        type: 'INTEGER',
    },
    year: {
        name: 'year',
        type: 'INTEGER',
    },
    boatAttacks: {
        name: 'boat_attacks',
        type: 'INTEGER',
    },
    decksUsed: {
        name: 'decks_used',
        type: 'INTEGER',
    },
    decksUsedToday: {
        name: 'decks_used_today',
        type: 'INTEGER',
    },
    repairPoints: {
        name: 'repairPoints',
        type: 'INTEGER',
    },
    fame: {
        name: 'fame',
        type: 'INTEGER',
    },
}

class Participant {
    constructor() {
        this.id = 0
        this.createdAt = ""
        this.updatedAt = ""
        this.tag = ""
        this.day = 0
        this.week = 0
        this.month = 0
        this.year = 0
        this.boatAttacks = 0
        this.decksUsed = 0
        this.decksUsedToday = 0
        this.repairPoints = 0
        this.fame = 0
    }
}

module.exports = {
    Participant,
    participantModel
}