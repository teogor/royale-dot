const {autocompleteUnlink} = require("./handlers/unlink-clan");
const {linkedClansHandler} = require("../../../database/handle/linked-clans-handler");
const {clansHandler} = require("../../../database/handle/clans-handler");

async function getTag(tag, guildID) {
    if (guildID !== undefined && guildID !== null) {
        const guildLinked = await linkedClansHandler.isLinked(guildID)
        if (guildLinked.isGuildLinked) {
            tag = guildLinked.tag
        } else {
            return null
        }
    }
    // remove all whitespaces
    tag = tag.replace(/\s/g, '')

    if (/^([0289PYLQGRJCUV])+$/.test(tag) || /^#([0289PYLQGRJCUV])+$/.test(tag)) {
        return null
    }
    if (tag[0] !== '#') {
        tag = `#${tag}`
    }
    return tag
}

async function autocompleteClans(client, interaction) {
    const tag = await getTag(interaction.options.getString('tag'))
    const guildID = interaction.guild.id

    if (tag === null) {
        return
    }

    let recommendedClans = []
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        const autocompleteClan = {
            name: `${clanDetails.name} (${guildLinked.tag})`,
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
    interaction.respond(recommendedClans);
}

const autocomplete = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'info') {
        await autocompleteClans(client, interaction)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        await autocompleteUnlink(client, interaction)
    } else if (interaction.options.getSubcommand() === 'members') {
        await autocompleteClans(client, interaction)
    } else if (interaction.options.getSubcommand() === 'river-race') {
        await autocompleteClans(client, interaction)
    }
}

module.exports = {
    autocomplete
}