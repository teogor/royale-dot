const {royaleBeautifier} = require("../../../beautifier");

async function buttonClanInfo(client, interaction) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getClan(tag, guildID)
    })
}

async function actionInfo(client, interaction) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getClan(tag, guildID)
    })
}

module.exports = {
    actionInfo,
    buttonClanInfo
}