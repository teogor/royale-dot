const discordClient = require("../client");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../res/values/colors");
const {Emojis} = require("../../../res/values/emojis");
const {getBadge} = require("../../../res/values/badges");
const {getKingLevel} = require("../../../res/values/king-levels");
const guildRepository = require("../../database/repository/guild-repository");
const {royaleRepository} = require("../../royale/repository");
const {newsRiverRaceInfo} = require("../interactions/river-race/news");

class OnClashRoyaleUpdate {

    //#region VARIABLES
    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }

    get commands() {
        return this._commands;
    }

    set commands(value) {
        this._commands = value;
    }

    //#endregion VARIABLES

    static bind(client) {
        const onClashRoyaleUpdate = new OnClashRoyaleUpdate(client)
        onClashRoyaleUpdate.listen()
    }

    constructor(client) {
        this.client = client
    }

    listen() {
        this.client.on("clash-royale", async (data) => {
            if (data.type === 'clan-update') {
                const {clan, elements} = data
                let fields = []

                let whatHasChanged = ``
                if (elements.description !== undefined) {
                    whatHasChanged += `description, `
                    const {
                        newValue,
                        oldValue
                    } = elements.description
                    fields.push(
                        {
                            name: `Old Description`,
                            value: `${oldValue}`,
                            inline: true
                        },
                        {
                            name: ` <-> `,
                            value: `----`,
                            inline: true
                        },
                        {
                            name: `New Description`,
                            value: `${newValue}`,
                            inline: true
                        }
                    )
                }
                if (elements.type !== undefined) {
                    whatHasChanged += `join type, `
                    const {
                        newValue,
                        oldValue
                    } = elements.type
                    fields.push(
                        {
                            name: `Old Type`,
                            value: `${oldValue}`,
                            inline: true
                        },
                        {
                            name: ` <-> `,
                            value: `----`,
                            inline: true
                        },
                        {
                            name: `New Type`,
                            value: `${newValue}`,
                            inline: true
                        }
                    )
                }
                whatHasChanged = whatHasChanged.slice(0, -2)
                if (fields.length > 0) {
                    fields.unshift({
                        name: `What's Changed:`,
                        value: `${whatHasChanged}`,
                    })

                    data.channels.forEach(channelData => {
                        const {
                            channelClanNewsId
                        } = channelData
                        discordClient.channels.fetch(channelClanNewsId).then(channel => {
                            if (channel === null) {
                                console.log(`channel: null, channelId: ${channelClanNewsId}`)
                                return
                            }
                            const {
                                clan
                            } = data
                            channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`${getBadge(clan.badgeId)} ${clan.name} (${clan.tag}) | Logs`)
                                        .setFields(fields)
                                        .setFooter({
                                            text: 'Last Updated at'
                                        })
                                        .setColor(ColorsValues.colorClanUpdates)
                                        .setTimestamp(Date.now())
                                ],
                                ephemeral: false,
                            })
                        })
                    })
                }
            } else if (data.type === 'rank-update') {
                const {clan, elements, member} = data

                if (elements.role !== undefined) {
                    const {
                        newValue,
                        oldValue
                    } = elements.role
                    const newRankText = newValue.type < oldValue.type ? 'Promoted' : 'Demoted'
                    let description = `${member.name} (\`${member.tag}\`) was **${newRankText}**`
                    description += `\nNew Rank: ${newValue.nameUp}`
                    data.channels.forEach(channelData => {
                        const {
                            channelId,
                            guildId
                        } = channelData
                        guildRepository.getGuild(guildId).then(guild => {
                            discordClient.guilds.fetch(guildId).then(discordGuild => {
                                const {
                                    roleLeaderId,
                                    roleColeaderId,
                                    roleElderId,
                                    roleMemberId
                                } = guild

                                const leaderRole = discordGuild.roles.cache.get(roleLeaderId)
                                const coleaderRole = discordGuild.roles.cache.get(roleColeaderId)
                                const elderRole = discordGuild.roles.cache.get(roleElderId)
                                const memberRole = discordGuild.roles.cache.get(roleMemberId)

                                let newRole, oldRole
                                switch (newValue.type) {
                                    case 1:
                                        // member
                                        newRole = memberRole
                                        break
                                    case 2:
                                        // elder
                                        newRole = elderRole
                                        break
                                    case 3:
                                        // coleader
                                        newRole = coleaderRole
                                        break
                                    case 4:
                                        // leader
                                        newRole = leaderRole
                                        break
                                }
                                switch (oldValue.type) {
                                    case 1:
                                        // member
                                        oldRole = memberRole
                                        break
                                    case 2:
                                        // elder
                                        oldRole = elderRole
                                        break
                                    case 3:
                                        // coleader
                                        oldRole = coleaderRole
                                        break
                                    case 4:
                                        // leader
                                        oldRole = leaderRole
                                        break
                                }

                                discordClient.channels.fetch(channelId).then(channel => {
                                    if (channel === null) {
                                        console.log(`channel: null, channelId: ${channelId}`)
                                    }
                                    channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setTitle(`${getBadge(clan.badgeId)} ${clan.name} (${clan.tag}) | Logs`)
                                                .setDescription(description)
                                                .setFooter({
                                                    text: 'Last Updated at'
                                                })
                                                .setColor(ColorsValues.colorClanUpdates)
                                                .setTimestamp(Date.now())
                                        ],
                                        ephemeral: false,
                                    }).catch(_ => {

                                    })
                                })
                            })
                        })
                    })
                }
            } else if (data.type === 'river-race-update') {
                let whatsChanged = ""
                data.elements.forEach(element => {
                    whatsChanged += `${element.item}: ~~${element.oldValue}~~ -> ${element.newValue}\n`
                })
                data.channelsId.forEach(channelId => {
                    discordClient.channels.fetch(channelId).then(channel => {
                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(ColorsValues.colorRiverRaceUpdates)
                                    .setDescription(`${Emojis.Check} Account linked to **undefined**!`)
                            ],
                            ephemeral: false,
                        })
                    })
                })
            } else if (data.type === 'player-joined') {
                this.handlePlayerJoined(data)
            } else if (data.type === 'player-left') {
                this.handlePlayerLeft(data)
            } else if (data.type === 'river-race-all-decks-used') {
                this.handlePlayerUsedAllDecksRiverRace(data)
            } else if (data.type === 'river-race-news') {
                this.handleRiverRaceNews(data)
            }
        })
    }

    handlePlayerJoined(data) {
        data.channels.forEach(channelData => {
            const {
                channelId
            } = channelData
            discordClient.channels.fetch(channelId).then(channel => {
                if (channel === null) {
                    console.log(`channel: null, channelId: ${channelId}`)
                }
                const {
                    clan,
                    member
                } = data
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${getBadge(clan.badgeId)} ${clan.name} (${clan.tag}) | Logs`)
                            .setDescription(`**Player Joined**\n${member.name} (\`${member.tag}\`) - ${getKingLevel(member.expLevel)} - ${Emojis.Trophies} ${member.trophies}`)
                            .setFooter({
                                text: 'Last Updated at'
                            })
                            .setColor(ColorsValues.colorBotGreen)
                            .setTimestamp(Date.now())
                    ],
                    ephemeral: false,
                }).catch(e => {
                    console.log(e)
                })
            })
        })
    }

    handlePlayerLeft(data) {
        data.channels.forEach(channelData => {
            const {
                channelId
            } = channelData
            discordClient.channels.fetch(channelId).then(channel => {
                if (channel === null) {
                    console.log(`channel: null, channelId: ${channelId}`)
                }
                const {
                    clan,
                    member
                } = data
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${getBadge(clan.badgeId)} ${clan.name} (${clan.tag}) | Logs`)
                            .setDescription(`**Player Left**\n${member.name} (\`${member.tag}\`) - ${getKingLevel(member.expLevel)} - ${Emojis.Trophies} ${member.trophies}`)
                            .setFooter({
                                text: 'Last Updated at'
                            })
                            .setColor(ColorsValues.colorBotRed)
                            .setTimestamp(Date.now())
                    ],
                    ephemeral: false,
                }).catch(e => {
                    console.log(e)
                })
            })
        })
    }

    handlePlayerUsedAllDecksRiverRace(data) {
        data.channels.forEach(channelData => {
            const {
                channelRiverRaceNewsId
            } = channelData
            discordClient.channels.fetch(channelRiverRaceNewsId).then(channel => {
                if (channel === null) {
                    console.log(`channel: null, channelId: ${channelRiverRaceNewsId}`)
                    return
                }
                const {
                    clan,
                    member
                } = data
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${getBadge(clan.badgeId)} ${clan.name} (${clan.tag}) | River Race`)
                            .setDescription(`${member.name} (\`${member.tag}\`) - Used all the decks for today`)
                            .setFooter({
                                text: 'Last Updated at'
                            })
                            .setColor(ColorsValues.colorRiverRaceUpdates)
                            .setTimestamp(Date.now())
                    ],
                    ephemeral: false,
                }).catch(e => {
                    console.log(e)
                })
            })
        })
    }

    handleRiverRaceNews(data) {
        data.channels.forEach(channelData => {
            const {
                channelRiverRaceNewsId
            } = channelData
            royaleRepository.getClanRiverRace(channelData.tag).then(riverRaceData => {
                const riverRace = riverRaceData.clanRiverRace

                discordClient.channels.fetch(channelRiverRaceNewsId).then(channel => {
                    if (channel === null) {
                        console.log(`channel: null, channelId: ${channelRiverRaceNewsId}`)
                        return
                    }

                    newsRiverRaceInfo(channel, riverRace)
                })
            }).catch(error => {
                console.log(error)
            })
        })
    }
}

module.exports = {
    OnClashRoyaleUpdate
}
