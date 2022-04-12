const {actionRanks} = require("./handlers/ranks");
const {actionLinkClan} = require("./handlers/link-clan");
const {actionInfo} = require("./handlers/info");
const {actionUnlink} = require("./handlers/unlink-clan");
const {actionMembers} = require("./handlers/members");
const {actionCurrentRiverRace} = require("./handlers/river-race");

const action = async (client, interaction) => {
    if (interaction.options.getSubcommand() === 'ranks') {
        await actionRanks(client, interaction)
    } else if (interaction.options.getSubcommand() === 'link') {
        await actionLinkClan(client, interaction)
    } else if (interaction.options.getSubcommand() === 'info') {
        await actionInfo(client, interaction)
    } else if (interaction.options.getSubcommand() === 'members') {
        await actionMembers(client, interaction)
    } else if (interaction.options.getSubcommand() === 'unlink') {
        await actionUnlink(client, interaction)
    } else if (interaction.options.getSubcommand() === 'river-race') {
        await actionCurrentRiverRace(client, interaction)
    }
}

module.exports = {
    action
}