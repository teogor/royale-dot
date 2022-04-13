const {sortClanMembers} = require("./clan/clan-members");
const {sortRiverRaceParticipants} = require("./clan/river-race-participants");

const onSort = (interaction, client) => {
    interaction.arguments = interaction.values[0].split("-").slice(1)

    switch (interaction.customId) {
        case 'sort_clan_members':
            sortClanMembers(interaction, client)
            break
        case 'sort_river_race_participants':
            sortRiverRaceParticipants(interaction, client)
            break
        default:
            console.log(interaction.customId)
            break
    }
}

module.exports = onSort