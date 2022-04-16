const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");
const guildRepository = require("../../../database/repository/guild-repository");
const clanRepository = require("../../../database/repository/clan-repository");

async function getLinkedClan(guildID) {
    const guild = await guildRepository.getGuild(guildID)
    if (guild.isLinked) {
        const tag = guild.tag
        const clan = await clanRepository.getClan(tag)
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Check} Server is already linked to **${clan.name}** (\`${clan.tag}\`)!`)
            ],
            ephemeral: true
        }
    }
    return {
        guild
    }
}

async function linkClan(tag, guild) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }

    const clanInfo = await royaleRepository.getClan(tag)
    if (clanInfo.error) {
        return clanInfo
    }
    const clan = clanInfo.clan.details
    guild.tag = clan.tag
    guildRepository.linkClan(guild).catch(error => {
        console.log(error)
    })

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
        const guild = linkedClanData.guild
        linkClan(tag, guild).then(linkedData => {
            sendFollowUp(interaction, linkedData)
        })
    })
}

module.exports = {
    commandClanLink
}