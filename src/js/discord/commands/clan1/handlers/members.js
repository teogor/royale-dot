const {royaleBeautifier} = require("../../../beautifier");

async function buttonMembers(client, interaction) {
    const guildID = interaction.guild.id
    const tag = interaction.arguments[0]

    await interaction.followUp({
        ...await royaleBeautifier.getClanMembers(tag, guildID)
    })
}

async function sortMembers(client, interaction) {
    const guildID = interaction.guild.id
    const args = interaction.arguments

    const sortType = args[0]
    const tag = args[1]
    const page = parseInt(args[2])

    await interaction.update({
        ...await royaleBeautifier.getClanMembers(tag, guildID, sortType, page)
    })
}

async function actionMembers(client, interaction) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getClanMembers(tag, guildID)
    })
}

module.exports = {
    buttonMembers,
    sortMembers,
    actionMembers
}