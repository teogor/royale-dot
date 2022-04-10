const discordClient = require("../../../client");
const {guildsHandler} = require("../../../../database/handle/guilds-handler");

async function actionSetClanUpdatesChannel(client, interaction) {
    const channel = interaction.options.getChannel("channel")
    if (channel.type !== "GUILD_TEXT") {
        await interaction.followUp({
            content: `The selected channel must be of text type`
        })
        return
    }
    await guildsHandler.updateClanUpdatesChannel(interaction.guild.id, channel.id)
    await interaction.followUp({
        content: `Channel selected`
    })
}

module.exports = {
    actionSetClanUpdatesChannel
}