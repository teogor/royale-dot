const {reportModel} = require("../model/report");

class ReportEntity {

    constructor() {
        this.tableName = 'reports'
        this.tableModel = reportModel
        this.options = {
            unique: [
                reportModel.guildId,
                reportModel.type,
                reportModel.hours,
                reportModel.minutes,
            ]
        }
    }

}

module.exports = ReportEntity