const {MessageEmbed} = require("discord.js");

async function actionRanks(client, interaction) {
    let rank = interaction.options.getRole('rank')
    let color = interaction.options.getString('color')
    if (!color.startsWith('#')) {
        color = '#' + color
    }

    interaction.guild.roles.cache.forEach(role => {
        if (rank.id === role.id) {
            role.edit({
                color
            })
        }
    });

    await interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor(color)
                .setDescription(`:id: Color updated for <@&${rank.id}>!`)
        ],
    })
}

module.exports = {
    actionRanks
}