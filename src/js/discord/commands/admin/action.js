const {actionSetClanUpdatesChannel} = require("./handlers/set-channels");

const action = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'set-clan-updates-channel') {
        await actionSetClanUpdatesChannel(client, interaction)
    }
}

module.exports = {
    action
}