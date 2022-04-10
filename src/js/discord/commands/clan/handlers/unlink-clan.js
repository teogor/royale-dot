const {clansHandler} = require("../../../../database/handle/clans-handler");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {linkedClansHandler} = require("../../../../database/handle/linked-clans-handler");

async function autocompleteUnlink(client, interaction) {
    const guildID = interaction.guild.id

    const guildLinked = await linkedClansHandler.isLinked(guildID)
    let recommendedClans = []
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        const autocompleteClan = {
            name: `${clanDetails.name} (${guildLinked.tag})`,
            value: `${guildLinked.tag}`
        }
        recommendedClans.push(autocompleteClan)
    }
    interaction.respond(recommendedClans);
}

async function actionUnlink(client, interaction) {
    const guildID = interaction.guild.id
    let tag = interaction.options.getString('tag')

    if (!tag.startsWith("#")) {
        tag = `#${tag}`
    }

    await linkedClansHandler.unlinkClan(
        guildID,
        tag
    )

    await interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor(ColorsValues.colorBotGreen)
                .setDescription(
                    `The clan was unlinked successfully`
                )
        ],
    })
}

module.exports = {
    autocompleteUnlink,
    actionUnlink
}