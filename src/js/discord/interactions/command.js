const {commandClanMembers} = require("./clan/clan-members");
const {commandClanRanks} = require("./clan/ranks");
const {commandClanInfo} = require("./clan/info");
const {commandClanLink} = require("./clan/link");
const {commandClanUnlink} = require("./clan/unlink");
const {commandClanRiverRace} = require("./clan/river-race");
const {commandRiverRaceParticipants} = require("./clan/river-race-participants");
const {commandPing} = require("./ping/pong");
const {commandPlayerLink} = require("./player/link");
const {commandPlayerUnlink} = require("./player/unlink");
const {commandPlayerOverview} = require("./player/overview");
const {commandPlayerProfile} = require("./player/profile");
const {commandRiverRaceContribution} = require("./player/river-race-contribution");
const {commandSetClanNews} = require("./set/clan-news");
const {commandSetRiverRaceNews} = require("./set/river-race-news");

function onClanCommand(interaction, client) {
    if (interaction.options.getSubcommand() === 'rank-color') {
        commandClanRanks(interaction, client)
    } else if (interaction.options.getSubcommand() === 'members') {
        commandClanMembers(interaction, client)
    } else if (interaction.options.getSubcommand() === 'info') {
        commandClanInfo(interaction, client)
    } else if (interaction.options.getSubcommand() === 'link') {
        commandClanLink(interaction, client)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        commandClanUnlink(interaction, client)
    } else if (interaction.options.getSubcommand() === 'river-race') {
        commandClanRiverRace(interaction, client)
    } else if (interaction.options.getSubcommand() === 'river-race-participants') {
        commandRiverRaceParticipants(interaction, client)
    } else {
        console.log(`command not handled: ${interaction.options.getSubcommand()}`)
    }
}

function onPingCommand(interaction, client) {
    commandPing(interaction, client)
}

function onPlayerCommand(interaction, client) {
    if (interaction.options.getSubcommand() === 'link') {
        commandPlayerLink(interaction, client)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        commandPlayerUnlink(interaction, client)
    } else if (interaction.options.getSubcommand() === 'overview') {
        commandPlayerOverview(interaction, client)
    } else if (interaction.options.getSubcommand() === 'profile') {
        commandPlayerProfile(interaction, client)
    } else if (interaction.options.getSubcommand() === 'river-race-contribution') {
        commandRiverRaceContribution(interaction, client)
    } else {
        console.log(`command not handled: ${interaction.options.getSubcommand()}`)
    }
}

function onSetCommand(interaction, client) {
    if (interaction.options.getSubcommand() === 'clan-news') {
        commandSetClanNews(interaction, client)
    } else if (interaction.options.getSubcommand() === 'river-race-news') {
        commandSetRiverRaceNews(interaction, client)
    } else {
        console.log(`command not handled: ${interaction.options.getSubcommand()}`)
    }
}

const onCommand = (interaction, client) => {
    const command = client.slashCommands.find(command => command.name === interaction.commandName)
    if (!command) {
        return interaction.followUp({
            content: "An error has occurred",
            ephemeral: true
        });
    }

    interaction.deferReply({ephemeral: false}).catch(error => {
        console.error(error)
    });

    switch (command.name) {
        case 'clan':
            onClanCommand(interaction, client)
            break
        case 'ping':
            onPingCommand(interaction, client)
            break
        case 'player':
            onPlayerCommand(interaction, client)
            break
        case 'set':
            onSetCommand(interaction, client)
            break
    }
}

module.exports = onCommand