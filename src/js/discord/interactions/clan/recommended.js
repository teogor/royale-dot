const {linkedClansHandler} = require("../../../database2/handle/linked-clans-handler");
const {clansHandler} = require("../../../database2/handle/clans-handler");

async function getClans(tag, guildID) {
    let recommendedClans = []
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        const autocompleteClan = {
            name: `LINKED: ${clanDetails.name} (${guildLinked.tag})`,
            value: `${guildLinked.tag}`
        }
        recommendedClans.push(autocompleteClan)
    }

    const recommendedClansDB = await clansHandler.getRecommendedClans(tag)
    recommendedClansDB.forEach(recommendedClan => {
        if (recommendedClan.tag !== guildLinked.tag) {
            const autocompleteClan = {
                name: `${recommendedClan.name} (${recommendedClan.tag})`,
                value: `${recommendedClan.tag}`
            }
            recommendedClans.push(autocompleteClan)
        }
    })
    return recommendedClans
}

function autocompleteClans(interaction, client) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    getClans(tag, guildID).then(clans => {
        interaction.respond(clans);
    })
}

module.exports = {
    autocompleteClans
}