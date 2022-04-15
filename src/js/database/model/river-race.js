const riverRaceModel = {
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
    fame: {
        name: 'fame',
        type: 'INTEGER',
    },
    boatPoints: {
        name: 'boat_points',
        type: 'INTEGER',
    },
    boatAttacks: {
        name: 'boat_attacks',
        type: 'INTEGER',
    },
    battleType: {
        name: 'battle_type',
        type: 'INTEGER',
    },

}

class RiverRace {
    constructor() {
        this.id = 0
        this.createdAt = ""
        this.updatedAt = ""
        this.tag = ""
        this.day = 0
        this.week = 0
        this.month = 0
        this.year = 0
        this.fame = 0
        this.boatPoints = 0
        this.boatAttacks = 0
        this.battleType = 0
    }
}

module.exports = {
    RiverRace,
    riverRaceModel
}