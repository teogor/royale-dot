const {playersHandler} = require("../../../../database/handle/players-handler");
const {linkedClansHandler} = require("../../../../database/handle/linked-clans-handler");
const {royaleBeautifier} = require("../../../beautifier");
const {royaleRepository} = require("../../../../royale/repository");

async function autocompleteInfo(client, interaction) {
    const guildID = interaction.guild.id
    const tag = interaction.options.getString('tag')

    const guildLinked = await linkedClansHandler.isLinked(guildID)
    let recommendedClans = []
    if (guildLinked.isGuildLinked) {
        const members = await playersHandler.getForClan(guildLinked.tag, tag)
        members.forEach(member => {
            const autocompleteClan = {
                name: `${member.name} (${member.tag})`,
                value: `${member.tag}`
            }
            recommendedClans.push(autocompleteClan)
        })
    }
    interaction.respond(recommendedClans.slice(0, 25));
}

async function buttonUserOverview(client, interaction) {
    const tag = interaction.arguments[0]
    console.log(tag)

    return await interaction.followUp({
        ...await royaleBeautifier.getPlayerInfo(tag)
    })
}

// todo buttonViewAccount
async function buttonViewAccount(client, interaction) {
    const tag = interaction.arguments[0]

    return await interaction.followUp({
        ...await royaleBeautifier.getPlayerProfile(tag)
    })
}

async function actionInfo(client, interaction) {
    const tag = interaction.options.getString('tag')
    const user = interaction.options.getUser('user')
    const userID = user ? user.id : null
    const playerID = interaction.user.id

    const playerTag = await royaleRepository.getPlayerTag(tag, userID, playerID)
    if (playerTag.error) {
        return await interaction.followUp({
            ...playerTag
        })
    }
    return await interaction.followUp({
        ...await royaleBeautifier.getPlayerInfo(playerTag.tag)
    })
}

async function playerProfile(client, interaction) {
    const tag = interaction.options.getString('tag')
    const user = interaction.options.getUser('user')
    const userID = user ? user.id : null
    const playerID = interaction.user.id

    const playerTag = await royaleRepository.getPlayerTag(tag, userID, playerID)
    if (playerTag.error) {
        return await interaction.followUp({
            ...playerTag
        })
    }
    return await interaction.followUp({
        ...await royaleBeautifier.getPlayerProfile(playerTag.tag)
    })
}

async function selectMenuMemberInfo(client, interaction) {
    const tag = interaction.values[0]

    return await interaction.followUp({
        ...await royaleBeautifier.getPlayerInfo(tag)
    })
}

module.exports = {
    autocompleteInfo,
    actionInfo,
    selectMenuMemberInfo,
    buttonUserOverview,
    buttonViewAccount,
    playerProfile
}