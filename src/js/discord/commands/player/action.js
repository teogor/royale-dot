const {actionLinkAccount} = require("./handlers/link-account");
const {actionInfo} = require("./handlers/info");

const action = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'link') {
        await actionLinkAccount(client, interaction)
    } else if (interaction.options.getSubcommand() === 'info') {
        await actionInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'stats') {
        // await handleStatsAccount(client, interaction)
    }
}

module.exports = {
    action
}