const {autocompleteInfo} = require("./handlers/info");
const {autocompleteUnlink} = require("./handlers/unlink-clan");

const autocomplete = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'info') {
        await autocompleteInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        await autocompleteUnlink(client, interaction)
    }
}

module.exports = {
    autocomplete
}