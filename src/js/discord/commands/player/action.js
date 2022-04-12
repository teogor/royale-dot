const {actionLinkAccount, actionUnlink} = require("./handlers/link-account");
const {actionInfo, playerProfile} = require("./handlers/info");

const action = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'link') {
        await actionLinkAccount(client, interaction)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        await actionUnlink(client, interaction)
    } else if (interaction.options.getSubcommand() === 'overview') {
        await actionInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'profile') {
        await playerProfile(client, interaction)
    }
}

module.exports = {
    action
}