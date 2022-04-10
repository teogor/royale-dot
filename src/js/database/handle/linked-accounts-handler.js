const {AppDAO} = require("../dao");
const {LinkedAccountsRepository} = require("../repository/linked-accounts-repository");

class LinkedAccountsHandler {

    //#region VARIABLES
    get linkedAccountsRepository() {
        return this._linkedAccountsRepository;
    }

    set linkedAccountsRepository(value) {
        this._linkedAccountsRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.linkedAccountsRepository = new LinkedAccountsRepository(AppDAO)
    }

    async linkPlayer(
        guildID,
        playerID,
        playerTag
    ) {
        return this.linkedAccountsRepository.linkPlayer(guildID, playerID, playerTag)
    }

    async isLinked(
        guildID,
        playerID,
        playerTag
    ) {
        return this.linkedAccountsRepository.isLinked(guildID, playerID, playerTag)
    }

    async unlinkPlayer(
        guildID,
        playerID,
        playerTag
    ) {
        return this.linkedAccountsRepository.unlinkPlayer(guildID, playerID, playerTag)
    }
}

module.exports = {
    linkedAccountsHandler: new LinkedAccountsHandler()
}