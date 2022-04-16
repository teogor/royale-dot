const {autocompleteClanUnlink} = require("./clan/unlink");
const {autocompleteClans} = require("./clan/recommended");
const {autocompletePlayerUnlink} = require("./player/unlink");
const {autocompletePlayerLink} = require("./player/link");
const {autocompletePlayers} = require("./player/recommended");

function onClanAutocomplete(interaction, client) {

    const subcommand = interaction.options.getSubcommand()
    switch (subcommand) {
        case 'unlink':
            autocompleteClanUnlink(interaction, client)
            break
        case 'info':
        case 'members':
        case 'river-race':
        case 'river-race-participants':
            autocompleteClans(interaction, client)
            break
        default:
            console.log(subcommand)
            break
    }

}

function onPlayerAutocomplete(interaction, client) {

    const subcommand = interaction.options.getSubcommand()
    switch (subcommand) {
        case 'unlink':
            autocompletePlayerUnlink(interaction, client)
            break
        case 'link':
        case 'overview':
        case 'profile':
        case 'river-race-contribution':
            autocompletePlayers(interaction, client)
            break
        default:
            console.log(subcommand)
            break
    }

}

function onRiverRaceAutocomplete(interaction, client) {

    const subcommand = interaction.options.getSubcommand()
    switch (subcommand) {
        case 'contribution':
            autocompletePlayers(interaction, client)
            break
        case 'participants':
        case 'info':
            autocompleteClans(interaction, client)
            break
        default:
            console.log(subcommand)
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
        case 'player':
            onPlayerAutocomplete(interaction, client)
            break
        case 'river-race':
            onRiverRaceAutocomplete(interaction, client)
            break
    }

}

module.exports = onAutocomplete