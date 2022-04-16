const royaleDotDB = require("../royale-dot-database");

class ReportRepository {

    constructor() {

    }

    insertReport(report) {
        royaleDotDB.reportDAO.insertReport(report)
    }

    deleteReport(report) {
        royaleDotDB.reportDAO.deleteReport(report)
    }

    async getReports(report) {
        return royaleDotDB.reportDAO.getReports(report)
    }

}

const reportRepository = new ReportRepository()
module.exports = reportRepository