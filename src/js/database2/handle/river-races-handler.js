const {AppDAO} = require("../dao");
const {RiverRaceRepository} = require("../repository/river-races-repository");

class RiverRacesHandler {

    //#region VARIABLES
    get riverRacesRepository() {
        return this._riverRacesRepository;
    }

    set riverRacesRepository(value) {
        this._riverRacesRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.riverRacesRepository = new RiverRaceRepository(AppDAO)
    }

    create(
        tag,
        day,
        week,
        month,
        year,
        boatAttacks,
        decksUsed,
        decksUsedToday,
        repairPoints,
        fame
    ) {
        this.riverRacesRepository.create(
            tag,
            day,
            week,
            month,
            year,
            boatAttacks,
            decksUsed,
            decksUsedToday,
            repairPoints,
            fame
        )
    }

    update(
        tag,
        day,
        week,
        month,
        year,
        boatAttacks,
        decksUsed,
        decksUsedToday,
        repairPoints,
        fame
    ) {
        this.riverRacesRepository.update(
            tag,
            day,
            week,
            month,
            year,
            boatAttacks,
            decksUsed,
            decksUsedToday,
            repairPoints,
            fame
        )
    }

    async entryExists(tag, day, week, month, year) {
        return this.riverRacesRepository.entryExists(
            tag,
            day,
            week,
            month,
            year
        )
    }
}

module.exports = {
    riverRacesHandler: new RiverRacesHandler()
}