const {AppDAO} = require("../dao");
const {ClansRepository} = require("../repository/clans-repository");
const discordClient = require("../../discord/client");
const {guildsHandler} = require("./guilds-handler");

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

    connectClan(clan) {
        const tag = clan.tag
        this.exists(tag).then(exists => {
            if (!exists) {
                console.log('Clan does not exist!')
                this.clansRepository.connectClan(
                    tag,
                    clan.name,
                    clan.type,
                    clan.description,
                    clan.badgeId,
                    clan.clanScore,
                    clan.clanWarTrophies,
                    clan.requiredTrophies,
                    clan.donationsPerWeek,
                    clan.members,
                    clan.location.name,
                    clan.location.isCountry
                )
            } else {
                console.log('Clan does exist!')
                const newData = clan
                newData.location_name = newData.location.name
                newData.location_is_country = newData.location.isCountry ? 1 : 0
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
                    const diffs = this.deepDiffMapper.map(oldData, newData)
                    const changes = []
                    for (const key in diffs) {
                        const diff = diffs[key]
                        if (diff !== undefined) {
                            changes.push({
                                item: key,
                                oldValue: diff.oldValue,
                                newValue: diff.newValue
                            })
                        }
                    }
                    if (changes.length > 0) {
                        guildsHandler.getClanUpdateChannels(tag).then(channels => {
                            const channelsId = []
                            channels.forEach(channel => channelsId.push(channel.channelId))
                            discordClient.emit('clash-royale', {
                                update: true,
                                type: "clan-update",
                                elements: changes,
                                tag,
                                channelsId
                            });
                        })
                    }

                })
            }
        })
    }

    async exists(tag) {
        const data = await this.clansRepository.exists(tag)
        return data !== undefined
    }

    deepDiffMapper = function () {
        return {
            VALUE_CREATED: 'created',
            VALUE_UPDATED: 'updated',
            VALUE_DELETED: 'deleted',
            VALUE_UNCHANGED: 'unchanged',
            map: function (obj1, obj2) {
                let key;
                if (this.isFunction(obj1) || this.isFunction(obj2)) {
                    throw 'Invalid argument. Function given, object expected.';
                }
                if (this.isValue(obj1) || this.isValue(obj2)) {
                    if (this.compareValues(obj1, obj2) === this.VALUE_UPDATED) {
                        return {
                            type: this.compareValues(obj1, obj2),
                            newValue: obj2,
                            oldValue: obj1
                        };
                    } else {
                        return undefined
                    }

                }

                const diff = {};
                for (key in obj1) {
                    if (this.isFunction(obj1[key])) {
                        continue;
                    }

                    let value2 = undefined;
                    if (obj2[key] !== undefined) {
                        value2 = obj2[key];
                    }

                    diff[key] = this.map(obj1[key], value2);
                }
                for (key in obj2) {
                    if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                        continue;
                    }

                    diff[key] = this.map(undefined, obj2[key]);
                }

                return diff;

            },
            compareValues: function (value1, value2) {
                if (value1 === value2) {
                    return this.VALUE_UNCHANGED;
                }
                if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                    return this.VALUE_UNCHANGED;
                }
                if (value1 === undefined) {
                    return this.VALUE_CREATED;
                }
                if (value2 === undefined) {
                    return this.VALUE_DELETED;
                }
                return this.VALUE_UPDATED;
            },
            isFunction: function (x) {
                return Object.prototype.toString.call(x) === '[object Function]';
            },
            isArray: function (x) {
                return Object.prototype.toString.call(x) === '[object Array]';
            },
            isDate: function (x) {
                return Object.prototype.toString.call(x) === '[object Date]';
            },
            isObject: function (x) {
                return Object.prototype.toString.call(x) === '[object Object]';
            },
            isValue: function (x) {
                return !this.isObject(x) && !this.isArray(x);
            }
        }
    }();

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