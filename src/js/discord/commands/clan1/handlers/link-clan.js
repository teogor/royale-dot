const {royaleBeautifier} = require("../../../beautifier");

async function actionLinkClan(client, interaction) {
    const guildID = interaction.guildId
    const tag = interaction.options.getString('tag')

    return await interaction.followUp({
        ...await royaleBeautifier.linkClan(tag, guildID)
    })
}

module.exports = {
    actionLinkClan
}