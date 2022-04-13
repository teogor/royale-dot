const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {linkedClansHandler} = require("../../../database/handle/linked-clans-handler");
const {clansHandler} = require("../../../database/handle/clans-handler");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");

async function getLinkedClan(guildID) {
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (!guildLinked.isGuildLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Close} Server is not linked to any clans!`)
            ],
            ephemeral: true
        }
    }
    return {
        error: false,
        tag: guildLinked.tag
    }
}

async function unlinkClan(tag, guildID) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }

    return await linkedClansHandler.unlinkClan(
        guildID,
        tagData.tag
    )
}

function commandClanUnlink(interaction, client) {
    const guildID = interaction.guildId
    const tag = interaction.options.getString('tag')

    getLinkedClan(guildID).then(linkedClanData => {
        if (linkedClanData.error) {
            sendFollowUp(interaction, linkedClanData)
            return
        }
        if (linkedClanData.tag !== tag && linkedClanData.tag !== "#" + tag) {
            const response = {
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(
                            `${Emojis.Close} The tag does not match the one linked to this server!`
                        )
                ],
            }
            sendFollowUp(interaction, response)
        } else {
            unlinkClan(tag, guildID).then(_ => {
                const response = {
                    embeds: [
                        new MessageEmbed()
                            .setColor(ColorsValues.colorBotGreen)
                            .setDescription(
                                `The clan was unlinked successfully`
                            )
                    ],
                }
                sendFollowUp(interaction, response)
            })
        }
        console.log(linkedClanData)
    })
}

function autocompleteUnlink(interaction, client) {
    const guildID = interaction.guild.id

    linkedClansHandler.isLinked(guildID).then(linkedData => {
        if (linkedData.isGuildLinked) {
            clansHandler.getDetails(
                linkedData.tag
            ).then(details => {
                const autocompleteClan = {
                    name: `${details.name} (${linkedData.tag})`,
                    value: `${linkedData.tag}`
                }
                interaction.respond([
                    autocompleteClan
                ])
            })
        } else {
            interaction.respond([])
        }
    })
}

module.exports = {
    commandClanUnlink,
    autocompleteUnlink
}