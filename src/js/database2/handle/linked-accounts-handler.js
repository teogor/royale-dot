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

    async linkPlayer(playerID, playerTag) {
        return this.linkedAccountsRepository.linkPlayer(playerID, playerTag)
    }

    async isLinked(playerID, playerTag) {
        const data = await this.linkedAccountsRepository.isLinked(playerID, playerTag)
        return {
            isLinked: data.linked_accounts !== 0,
            isTagLinked: data.tags !== 0,
            tag: data.tag,
            name: data.name,
            linkedTag: data.linkedTag,
            linkedName: data.linkedName
        }
    }

    async getLinkedData(playerTag) {
        const data = await this.linkedAccountsRepository.getLinkedData(playerTag)
        if (data === null || data === undefined) {
            return {
                isLinked: false
            }
        }
        return {
            isLinked: true,
            tag: data.player_tag,
            id: data.player_id
        }
    }

    async unlinkPlayer(playerID, playerTag) {
        return this.linkedAccountsRepository.unlinkPlayer(playerID, playerTag)
    }
}

module.exports = {
    linkedAccountsHandler: new LinkedAccountsHandler()
}