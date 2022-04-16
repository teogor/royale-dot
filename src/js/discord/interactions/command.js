const {commandClanMembers} = require("./clan/clan-members");
const {commandClanRanks} = require("./clan/ranks");
const {commandClanInfo} = require("./clan/info");
const {commandClanLink} = require("./clan/link");
const {commandClanUnlink} = require("./clan/unlink");
const {commandPing} = require("./ping/pong");
const {commandPlayerLink} = require("./player/link");
const {commandPlayerUnlink} = require("./player/unlink");
const {commandPlayerOverview} = require("./player/overview");
const {commandPlayerProfile} = require("./player/profile");
const {commandRiverRaceContribution} = require("./river-race/contribution");
const {commandSetClanNewsChannel} = require("./clan/news-channel");
const {commandSetRiverRaceNewsChannel} = require("./river-race/news-channel");
const {commandRiverRaceInfo} = require("./river-race/info");
const {commandRiverRaceParticipants} = require("./river-race/participants");
const {commandReceiveClanNewsAt, commandCancelClanNewsAt} = require("./clan/news-at");
const {commandReceiveRiverRaceNewsAt, commandCancelRiverRaceNewsAt} = require("./river-race/news-at");

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
    } else if (interaction.options.getSubcommand() === 'set-news-channel') {
        commandSetClanNewsChannel(interaction, client)
    } else if (interaction.options.getSubcommand() === 'receive-news-at') {
        commandReceiveClanNewsAt(interaction, client)
    } else if (interaction.options.getSubcommand() === 'cancel-news-at') {
        commandCancelClanNewsAt(interaction, client)
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
    } else {
        console.log(`command not handled: ${interaction.options.getSubcommand()}`)
    }
}

function onRiverRaceCommand(interaction, client) {
    if (interaction.options.getSubcommand() === 'set-news-channel') {
        commandSetRiverRaceNewsChannel(interaction, client)
    } else if (interaction.options.getSubcommand() === 'contribution') {
        commandRiverRaceContribution(interaction, client)
    } else if (interaction.options.getSubcommand() === 'info') {
        commandRiverRaceInfo(interaction, client)
    } else if (interaction.options.getSubcommand() === 'participants') {
        commandRiverRaceParticipants(interaction, client)
    } else if (interaction.options.getSubcommand() === 'receive-news-at') {
        commandReceiveRiverRaceNewsAt(interaction, client)
    } else if (interaction.options.getSubcommand() === 'cancel-news-at') {
        commandCancelRiverRaceNewsAt(interaction, client)
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
        case 'river-race':
            onRiverRaceCommand(interaction, client)
            break
        case 'ping':
            onPingCommand(interaction, client)
            break
        case 'player':
            onPlayerCommand(interaction, client)
            break
    }
}

module.exports = onCommand