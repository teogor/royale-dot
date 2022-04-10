const {autocompleteInfo} = require("./handlers/info");
const {autocompleteLinkAccount} = require("./handlers/link-account");

const autocomplete = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'link') {
        await autocompleteLinkAccount(client, interaction)
    } else if (interaction.options.getSubcommand() === 'info') {
        await autocompleteInfo(client, interaction)
    }
}

module.exports = {
    autocomplete
}