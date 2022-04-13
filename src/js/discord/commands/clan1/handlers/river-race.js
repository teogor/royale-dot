const {royaleBeautifier} = require("../../../beautifier");

async function buttonCurrentRiverRace(client, interaction) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getClanRiverRace(tag, guildID)
    })
}

async function actionCurrentRiverRace(client, interaction) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getClanRiverRace(tag, guildID)
    })
}

async function selectMenuRiverRaceContribution(client, interaction) {
    const clanTag = interaction.arguments[0]
    const userTag = interaction.arguments[1]
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getRiverRaceContribution(clanTag, userTag, guildID)
    })
}

async function buttonRiverRaceContribution(client, interaction) {
    const clanTag = interaction.arguments[0]
    const userTag = interaction.arguments[1]
    const guildID = interaction.guild.id

    await interaction.followUp({
        ...await royaleBeautifier.getRiverRaceContribution(clanTag, userTag, guildID)
    })
}

module.exports = {
    buttonCurrentRiverRace,
    buttonRiverRaceContribution,
    selectMenuRiverRaceContribution,
    actionCurrentRiverRace
}