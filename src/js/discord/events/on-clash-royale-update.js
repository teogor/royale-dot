const {linkedClansHandler} = require("../../database/handle/linked-clans-handler");
const discordClient = require("../client");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../res/values/colors");
const {Emojis} = require("../../../res/values/emojis");
const {getBadge} = require("../../../res/values/badges");

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
            }
        })
    }
}

module.exports = {
    OnClashRoyaleUpdate
}
