const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");
const guildRepository = require("../../../database/repository/guild-repository");
const clanRepository = require("../../../database/repository/clan-repository");

async function getLinkedClan(guildID) {
    const guild = await guildRepository.getGuild(guildID)
    if (!guild.isLinked) {
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
        guild
    }
}

async function unlinkClan(tag, guild) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }

    return guildRepository.unlinkClan(guild)
}

function commandClanUnlink(interaction, client) {
    const guildID = interaction.guildId
    const tag = interaction.options.getString('tag')

    getLinkedClan(guildID).then(linkedClanData => {
        if (linkedClanData.error) {
            sendFollowUp(interaction, linkedClanData)
            return
        }
        if (linkedClanData.guild.tag !== tag && linkedClanData.guild.tag !== "#" + tag) {
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
            const guild = linkedClanData.guild
            unlinkClan(tag, guild).then(_ => {
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
    })
}

function autocompleteClanUnlink(interaction, client) {
    const guildID = interaction.guild.id

    guildRepository.getGuild(guildID).then(guild => {
        if (guild.isLinked) {
            clanRepository.getClan(guild.tag).then(clan => {
                const autocompleteClan = {
                    name: `${clan.name} (${clan.tag})`,
                    value: `${clan.tag}`
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
    autocompleteClanUnlink
}