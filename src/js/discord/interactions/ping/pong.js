const {sendFollowUp} = require("../response");

function commandPing(interaction, client) {
    const followUpMessage = {
        content: `:ping_pong:  Pong! (**${interaction.client.ws.ping}ms**)`
    }
    sendFollowUp(interaction, followUpMessage)
}

module.exports = {
    commandPing
}