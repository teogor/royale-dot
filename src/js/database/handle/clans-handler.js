const {AppDAO} = require("../dao");
const {ClansRepository} = require("../repository/clans-repository");
const discordClient = require("../../discord/client");
const {guildsHandler} = require("./guilds-handler");
const deepDiffMapper = require("../../utils/diff");

class ClansHandler {

    //#region VARIABLES
    get clansRepository() {
        return this._clansRepository;
    }

    set clansRepository(value) {
        this._clansRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.clansRepository = new ClansRepository(AppDAO)
    }

    connectNewClan(clan) {
        console.log('Clan does not exist!')
        this.clansRepository.connectClan(
            clan.tag,
            clan.name,
            clan.type,
            clan.description,
            clan.badgeId,
            clan.clanScore,
            clan.clanWarTrophies,
            clan.requiredTrophies,
            clan.donationsPerWeek,
            clan.members,
            clan.locationName,
            clan.locationIsCountry ? 1 : 0
        )
    }

    reconnectClan(clan) {
        const tag = clan.tag
        const newData = clan
        newData.location_name = newData.locationName
        newData.location_is_country = newData.locationIsCountry ? 1 : 0
        delete newData.location
        delete newData.clanChestMaxLevel
        delete newData.clanChestLevel
        delete newData.clanChestStatus
        delete newData.memberList
        delete newData.tag
        this.getFullDetails(tag).then(oldData => {
            this.clansRepository.updateClan(
                clan.type,
                clan.description,
                clan.badgeId,
                clan.clanScore,
                clan.clanWarTrophies,
                clan.requiredTrophies,
                clan.donationsPerWeek,
                clan.members,
                clan.location_name,
                clan.location_is_country,
                tag
            )
            const diffs = deepDiffMapper.map(oldData, newData)
            const changes = {}
            let hasChanges = false
            for (const key in diffs) {
                hasChanges = true
                const diff = diffs[key]
                if (diff !== undefined) {
                    changes[key] = {
                        key,
                        oldValue: diff.oldValue,
                        newValue: diff.newValue
                    }
                }
            }
            if (hasChanges) {
                guildsHandler.getClanUpdateChannels(tag).then(channels => {
                    const channelsId = []
                    channels.forEach(channel => channelsId.push(channel.channelId))
                    discordClient.emit('clash-royale', {
                        update: true,
                        type: "clan-update",
                        elements: changes,
                        clan: {
                            tag,
                            badgeId: newData.badgeId,
                            name: newData.name
                        },
                        channelsId
                    });
                })
            }

        })
    }

    connectClan(clan) {
        const tag = clan.tag
        this.exists(tag).then(exists => {
            if (!exists) {
                clan.tag = tag
                this.connectNewClan(clan)
            } else {
                clan.tag = tag
                this.reconnectClan(clan)
            }
        })
    }

    async exists(tag) {
        const data = await this.clansRepository.exists(tag)
        return data !== undefined
    }

    async getDetails(tag) {
        const data = await this.clansRepository.getDetails(tag)
        return {
            name: data.name,
            description: data.description,
            badgeID: data.badge_id
        }
    }

    async getFullDetails(tag) {
        const data = await this.clansRepository.getFullDetails(tag)
        return {
            name: data.name,
            description: data.description,
            badgeId: data.badge_id,
            clanScore: data.clan_score,
            clanWarTrophies: data.clan_war_trophies,
            requiredTrophies: data.required_trophies,
            donationsPerWeek: data.donations_per_week,
            members: data.members,
            type: data.type,
            location_name: data.location_name,
            location_is_country: data.location_is_country
        }
    }

    async getRecommendedClans(pattern) {
        pattern = `%${pattern.replace(/\s/g, '').split("").join("%")}%`
        return await this.clansRepository.getRecommendedClans(pattern).catch(err => {
            console.log(err)
        })
    }
}

module.exports = {
    clansHandler: new ClansHandler()
}