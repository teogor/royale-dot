const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {clansHandler} = require("../../../../database/handle/clans-handler");
const {linkedClansHandler} = require("../../../../database/handle/linked-clans-handler");
const {getClanInfo} = require("../../../../api/royale/handle");


async function actionLinkClan(client, interaction) {
    let tag = interaction.options.getString('tag')

    const guildId = interaction.guildId

    const guildLinked = await linkedClansHandler.isLinked(guildId)
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`:id: Server already linked to **${clanDetails.name}** (${guildLinked.tag})!`)
            ],
        })
        return
    }

    const requestClanInfo = {
        interaction,
        tag
    }

    const {
        clan
    } = await getClanInfo(requestClanInfo)
    if (clan === undefined) {
        return
    }

    linkedClansHandler.linkClan(guildId, clan.tag)

    await interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor(ColorsValues.colorBotGreen)
                .setDescription(`✅ Server linked to **${clan.name}** (${clan.tag})!`)
        ],
    })
}

module.exports = {
    actionLinkClan
}