const guildRepository = require("../../../database/repository/guild-repository");
const clanRepository = require("../../../database/repository/clan-repository");

async function getClans(keyword, guildID) {
    let recommendedClans = []
    const guild = await guildRepository.getGuild(guildID)
    if (guild.isLinked) {
        const tag = guild.tag
        const clan = await clanRepository.getClan(tag)
        const autocompleteClan = {
            name: `LINKED: ${clan.name} (${clan.tag})`,
            value: `${clan.tag}`
        }
        recommendedClans.push(autocompleteClan)
    }

    const recommendedClansDB = await clanRepository.getRecommendedClans(keyword)
    recommendedClansDB.forEach(recommendedClan => {
        if (recommendedClan.tag !== guild.tag) {
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