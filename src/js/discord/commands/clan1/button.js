const {buttonMembers} = require("./handlers/members");
const {buttonClanInfo} = require("./handlers/info");
const {buttonCurrentRiverRace, buttonRiverRaceContribution} = require("./handlers/river-race");

const button = async (client, interaction) => {
    if (interaction.customId === 'button_clan_members') {
        await buttonMembers(client, interaction)
    } else if (interaction.customId === 'view_clan') {
        await buttonClanInfo(client, interaction)
    } else if (interaction.customId === 'view_current_river_race') {
        await buttonCurrentRiverRace(client, interaction)
    } else if (interaction.customId === 'view_river_race_contribution') {
        await buttonRiverRaceContribution(client, interaction)
    }
}

module.exports = {
    button
}