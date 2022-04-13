const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {linkedClansHandler} = require("../../../database/handle/linked-clans-handler");
const {clansHandler} = require("../../../database/handle/clans-handler");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");
const {linkedAccountsHandler} = require("../../../database/handle/linked-accounts-handler");

async function getLinkedPlayer(userID, tag) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }
    tag = tagData.tag

    const playerLinked = await linkedAccountsHandler.isLinked(userID, tag)

    if (playerLinked.isLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Check} <@${userID}> is already linked to **${playerLinked.linkedName}**(\`${playerLinked.linkedTag}\`)!`)
            ],
            ephemeral: true
        }
    } else if (playerLinked.isTagLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setDescription(`${Emojis.Close} failed: tag is already linked to another player!`)
            ],
            ephemeral: true
        }
    }
    return playerLinked
}

async function linkPlayer(tag, guildID) {

    const clanInfo = await royaleRepository.getClan(tag)
    if (clanInfo.error) {
        return clanInfo
    }
    const clan = clanInfo.clan.details
    linkedClansHandler.linkClan(guildID, clan.tag)

    return {
        error: false,
        embeds: [
            new MessageEmbed()
                .setColor(ColorsValues.colorBotGreen)
                .setDescription(`${Emojis.Check} Server linked to **${clan.name}** (\`${clan.tag}\`)!`)
        ],
        ephemeral: true
    }
}

function commandPlayerLink(interaction, client) {
    const guildID = interaction.guildId
    const userID = interaction.user.id
    const tag = interaction.options.getString('tag')

    getLinkedPlayer(userID, tag).then(linkedPlayerData => {
        console.log(linkedPlayerData.tag)
        if (linkedPlayerData.error) {
            sendFollowUp(interaction, linkedPlayerData)
            return
        }
        linkPlayer(linkedPlayerData.tag, guildID).then(linkedData => {
            sendFollowUp(interaction, linkedData)
        })
    })
}

module.exports = {
    commandPlayerLink
}