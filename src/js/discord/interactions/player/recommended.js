const guildRepository = require("../../../database/repository/guild-repository");
const playerRepository = require("../../../database/repository/player-repository");

async function getPlayers(keyword, guildID) {
    const guild = await guildRepository.getGuild(guildID)
    if (guild.isLinked) {
        const tag = guild.tag
        const members = await playerRepository.getRecommended(tag, keyword)
        let recommendedClans = []
        members.forEach(member => {
            const autocompleteClan = {
                name: `${member.name} (${member.tag})`,
                value: `${member.tag}`
            }
            recommendedClans.push(autocompleteClan)
        })
        return recommendedClans.slice(0, 25)
    } else {
        return []
    }
}

function autocompletePlayers(interaction, client) {
    const guildID = interaction.guild.id
    const tag = interaction.options.getString('tag')

    getPlayers(tag, guildID).then(members => {
        interaction.respond(members);
    })
}

module.exports = {
    autocompletePlayers
}