const reportModel = {
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
    guildId: {
        name: 'guild_id',
        type: 'TEXT'
    },
    type: {
        name: 'type',
        type: 'INTEGER'
    },
    hours: {
        name: 'hours',
        type: 'INTEGER'
    },
    minutes: {
        name: 'minutes',
        type: 'INTEGER'
    },

}

class Report {

    static forClan(guildId, hours, minutes) {
        const report = new Report()
        report.hours = hours
        report.minutes = minutes
        report.guildId = guildId
        report.type = 0
        return report
    }

    static forRiverRace(guildId, hours, minutes) {
        const report = new Report()
        report.hours = hours
        report.minutes = minutes
        report.guildId = guildId
        report.type = 1
        return report
    }

    constructor() {
        this.id = 0
        this.createdAt = ""
        this.updatedAt = ""
        this.guildId = ""
        this.type = 0
        this.hours = 0
        this.minute = 0
    }
}

module.exports = {
    Report,
    reportModel
}