const royaleDotDB = require("../royale-dot-database");

class GuildRepository {

    constructor() {

    }

    async insertGuild(guild) {
        return royaleDotDB.guildDAO.insertGuild(guild)
    }

    async getGuild(guildId) {
        return royaleDotDB.guildDAO.getGuild(guildId)
    }

    updateRoles(guild) {
        royaleDotDB.guildDAO.updateRoles(guild)
    }

    updateChannels(guild) {
        royaleDotDB.guildDAO.updateChannels(guild)
    }

    async getClanNewsChannels() {
        return royaleDotDB.guildDAO.getClanNewsChannels()
    }

    async getRiverRaceNewsChannels() {
        return royaleDotDB.guildDAO.getRiverRaceNewsChannels()
    }

    async getClanNewsChannelsByTag(tag) {
        return royaleDotDB.guildDAO.getClanNewsChannelsByTag(tag)
    }

    async getRiverRaceNewsChannelsByTag(tag) {
        return royaleDotDB.guildDAO.getRiverRaceNewsChannelsByTag(tag)
    }

    async getRiverRaceNewsChannelsFor(hour, minutes) {
        return royaleDotDB.guildDAO.getRiverRaceNewsChannelsFor(hour, minutes)
    }

    async linkClan(guild) {
        return royaleDotDB.guildDAO.linkClan(guild)
    }

    async unlinkClan(guild) {
        return royaleDotDB.guildDAO.unlinkClan(guild)
    }

    async setClanNewsChannels(guild) {
        return royaleDotDB.guildDAO.setClanNewsChannels(guild)
    }

    async setRiverRaceNewsChannels(guild) {
        return royaleDotDB.guildDAO.setRiverRaceNewsChannels(guild)
    }

}

const guildRepository = new GuildRepository()
module.exports = guildRepository