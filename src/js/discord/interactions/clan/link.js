const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {linkedClansHandler} = require("../../../database/handle/linked-clans-handler");
const {clansHandler} = require("../../../database/handle/clans-handler");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");

async function getLinkedClan(guildID) {
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Check} Server is already linked to **${clanDetails.name}** (\`${guildLinked.tag}\`)!`)
            ],
            ephemeral: true
        }
    }
    return guildLinked
}

async function linkClan(tag, guildID) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }

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

function commandClanLink(interaction, client) {
    const guildID = interaction.guildId
    const tag = interaction.options.getString('tag')

    getLinkedClan(guildID).then(linkedClanData => {
        if (linkedClanData.error) {
            sendFollowUp(interaction, linkedClanData)
            return
        }
        linkClan(tag, guildID).then(linkedData => {
            sendFollowUp(interaction, linkedData)
        })
    })
}

module.exports = {
    commandClanLink
}