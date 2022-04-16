const {riverRaceModel} = require("../model/river-race");

class RiverRaceEntity {

    constructor() {
        this.tableName = 'river_races'
        this.tableModel = riverRaceModel
        this.options = {
            unique: [
                riverRaceModel.tag,
                riverRaceModel.day,
                riverRaceModel.week,
                riverRaceModel.month,
                riverRaceModel.year,
            ]
        }
    }

}

module.exports = RiverRaceEntity