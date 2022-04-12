const {setClanUpdatesChannel, setRiverRaceUpdatesChannel} = require("./handlers/set-channels");

const action = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'set-clan-channel') {
        await setClanUpdatesChannel(client, interaction)
    } else if (interaction.options.getSubcommand() === 'set-river-race-channel') {
        await setRiverRaceUpdatesChannel(client, interaction)
    }
}

module.exports = {
    action
}