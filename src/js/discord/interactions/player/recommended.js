const {linkedClansHandler} = require("../../../database2/handle/linked-clans-handler");
const {playersHandler} = require("../../../database2/handle/players-handler");

async function getPlayers(tag, guildID) {
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (guildLinked.isGuildLinked) {
        const members = await playersHandler.getForClan(guildLinked.tag, tag)
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