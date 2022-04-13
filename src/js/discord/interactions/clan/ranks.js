const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");

function commandClanRanks(interaction, client) {
    const rankId = interaction.options.getRole('rank').id
    const color = !interaction.options.getString('color').startsWith('#') ? `#${interaction.options.getString('color')}` : interaction.options.getString('color')

    const role = interaction.guild.roles.cache.get(rankId)
    if (role !== undefined) {
        role.edit({
            color
        }).then(_ => {
            const response = {
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`${Emojis.Check} Color updated for <@&${rankId}>!`)
                ],
                ephemeral: false
            }
            sendFollowUp(interaction, response)
        })
    } else {
        const response = {
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`${Emojis.Close} Failed to update <@&${rankId}>!`)
            ],
            ephemeral: true
        }
        sendFollowUp(interaction, response)
    }
}

module.exports = {
    commandClanRanks
}