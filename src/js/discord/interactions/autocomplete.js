const {autocompleteUnlink} = require("./clan/unlink");
const {autocompleteClans} = require("./clan/recommended");

function onClanAutocomplete(interaction, client) {

    const subcommand = interaction.options.getSubcommand()
    switch (subcommand) {
        case 'unlink':
            autocompleteUnlink(interaction, client)
            break
        case 'info':
        case 'members':
        case 'river-race':
        case 'river-race-participants':
            autocompleteClans(interaction, client)
            break
    }

}

const onAutocomplete = (interaction, client) => {
    const command = client.slashCommands.find(command => command.name === interaction.commandName)
    if (!command) {
        return interaction.followUp({
            content: "An error has occurred",
            ephemeral: true
        });
    }

    switch (command.name) {
        case 'clan':
            onClanAutocomplete(interaction, client)
            break
    }

}

module.exports = onAutocomplete