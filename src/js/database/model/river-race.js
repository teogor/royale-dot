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
    participants: {
        name: 'participants',
        type: 'INTEGER',
    },
    repairPoints: {
        name: 'repair_points',
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
    boatAttacks: {
        name: 'boat_attacks',
        type: 'INTEGER',
    },
    battleType: {
        name: 'battle_type',
        type: 'INTEGER',
    },
    pointsEarned: {
        name: 'points_earned',
        type: 'INTEGER',
    },
    progressStartOfDay: {
        name: 'progress_start_of_day',
        type: 'INTEGER',
    },
    progressEndOfDay: {
        name: 'progress_end_of_day',
        type: 'INTEGER',
    },
    endOfDayRank: {
        name: 'end_of_day_rank',
        type: 'INTEGER',
    },
    progressEarned: {
        name: 'progress_earned',
        type: 'INTEGER',
    },
    numOfDefensesRemaining: {
        name: 'num_of_defenses_remaining',
        type: 'INTEGER',
    },
    progressEarnedFromDefenses: {
        name: 'progress_earned_from_defenses',
        type: 'INTEGER',
    },

}

class RiverRace {

    static fromAPILogModel(riverRaceAPI) {
        const riverRace = new RiverRace()
        riverRace.tag = riverRaceAPI.clan.tag
        riverRace.day = riverRaceAPI.day
        riverRace.week = riverRaceAPI.week
        riverRace.month = riverRaceAPI.month
        riverRace.year = riverRaceAPI.year
        riverRace.pointsEarned = riverRaceAPI.pointsEarned
        riverRace.progressStartOfDay = riverRaceAPI.progressStartOfDay
        riverRace.progressEndOfDay = riverRaceAPI.progressEndOfDay
        riverRace.endOfDayRank = riverRaceAPI.endOfDayRank + 1
        riverRace.progressEarned = riverRaceAPI.progressEarned
        riverRace.numOfDefensesRemaining = riverRaceAPI.numOfDefensesRemaining
        riverRace.progressEarnedFromDefenses = riverRaceAPI.progressEarnedFromDefenses
        return riverRace
    }

    static fromAPIClanModel(riverRaceAPI) {
        const riverRace = new RiverRace()
        riverRace.tag = riverRaceAPI.tag
        riverRace.day = riverRaceAPI.day
        riverRace.week = riverRaceAPI.week
        riverRace.month = riverRaceAPI.month
        riverRace.year = riverRaceAPI.year
        riverRace.fame = riverRaceAPI.fame
        riverRace.participants = riverRaceAPI.attacks.participants
        riverRace.repairPoints = riverRaceAPI.attacks.repairPoints
        riverRace.decksUsed = riverRaceAPI.attacks.decksUsed
        riverRace.decksUsedToday = riverRaceAPI.attacks.decksUsedToday
        riverRace.boatAttacks = riverRaceAPI.attacks.boatAttacks
        return riverRace
    }

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
        this.participants = 0
        this.repairPoints = 0
        this.boatAttacks = 0
        this.battleType = 0
        this.pointsEarned = 0
        this.progressStartOfDay = 0
        this.progressEndOfDay = 0
        this.endOfDayRank = 0
        this.progressEarned = 0
        this.numOfDefensesRemaining = 0
        this.progressEarnedFromDefenses = 0
    }
}

module.exports = {
    RiverRace,
    riverRaceModel
}