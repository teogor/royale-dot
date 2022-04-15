const {AppDAO} = require("../dao");
const {LinkedClansRepository} = require("../repository/linked-clans-repository");

class LinkedClansHandler {

    //#region VARIABLES
    get linkedClansRepository() {
        return this._linkedClansRepository;
    }

    set linkedClansRepository(value) {
        this._linkedClansRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.linkedClansRepository = new LinkedClansRepository(AppDAO)
    }

    linkClan(guildID, clanTag) {
        this.linkedClansRepository.linkClan(guildID, clanTag)
    }

    async unlinkClan(guildID, clanTag) {
        return this.linkedClansRepository.unlinkClan(guildID, clanTag)
    }

    async isLinked(guildID) {
        const data = await this.linkedClansRepository.isLinked(guildID)
        return {
            isGuildLinked: data.items !== 0,
            tag: data.clan_tag
        }
    }

    async getGuilds(clanTag) {
        return await this.linkedClansRepository.getGuilds(clanTag)
    }
}

module.exports = {
    linkedClansHandler: new LinkedClansHandler()
}