const {autocompleteInfo} = require("./handlers/info");
const {autocompleteLinkAccount, autocompleteUnlink} = require("./handlers/link-account");

const autocomplete = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'link') {
        await autocompleteLinkAccount(client, interaction)
    } else if (interaction.options.getSubcommand() === 'overview') {
        await autocompleteInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'profile') {
        await autocompleteInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        await autocompleteUnlink(client, interaction)
    }
}

module.exports = {
    autocomplete
}