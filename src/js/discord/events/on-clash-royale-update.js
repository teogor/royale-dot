const {linkedClansHandler} = require("../../database/handle/linked-clans-handler");
const discordClient = require("../client");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../res/values/colors");
const {Emojis} = require("../../../res/values/emojis");
const {getBadge} = require("../../../res/values/badges");
const {playersHandler} = require("../../database/handle/players-handler");
const {guildsHandler} = require("../../database/handle/guilds-handler");

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
                    whatHasChanged += `type, `
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
                    data.channelsId.forEach(channelId => {
                        discordClient.channels.fetch(channelId).then(channel => {
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
                        guildsHandler.getRoles(guildId).then(roles => {
                            discordClient.guilds.fetch(guildId).then(guild => {
                                const {
                                    leader,
                                    coleader,
                                    elder,
                                    member
                                } = roles

                                const leaderRole = guild.roles.cache.get(leader)
                                const coleaderRole = guild.roles.cache.get(coleader)
                                const elderRole = guild.roles.cache.get(elder)
                                const memberRole = guild.roles.cache.get(member)

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
                            .setDescription(`**Player Joined**\n${member.name} (\`${member.tag}\`) - ${Emojis.KingLevel} ${member.expLevel} - ${Emojis.Trophies} ${member.trophies}`)
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
                            .setDescription(`**Player Left**\n${member.name} (\`${member.tag}\`) - ${Emojis.KingLevel} ${member.expLevel} - ${Emojis.Trophies} ${member.trophies}`)
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
}

module.exports = {
    OnClashRoyaleUpdate
}
