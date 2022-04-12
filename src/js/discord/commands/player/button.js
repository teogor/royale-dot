const {buttonUserOverview, buttonViewAccount} = require("./handlers/info");

const button = async (client, interaction) => {
    if (interaction.customId === 'view_profile_overview') {
        await buttonUserOverview(client, interaction)
    } else if (interaction.customId === 'view_player') {
        await buttonViewAccount(client, interaction)
    }
}

module.exports = {
    button
}