const {navigateClanMembers} = require("./clan/clan-members");
const {navigateRiverRaceParticipants} = require("./clan/river-race-participants");

const onNavigate = (interaction, client) => {
    const components = interaction.customId.split(" ")
    interaction.customId = components[0]
    interaction.arguments = components[1].split("-").slice(1)

    switch (interaction.customId) {
        case 'navigate_members_list_next':
            navigateClanMembers(interaction, client)
            break
        case 'navigate_members_list_previous':
            navigateClanMembers(interaction, client)
            break
        case 'navigate_river_race_participants_list_next':
            navigateRiverRaceParticipants(interaction, client)
            break
        case 'navigate_river_race_participants_list_previous':
            navigateRiverRaceParticipants(interaction, client)
            break
        default:
            console.log(interaction.customId)
            break
    }
}

module.exports = onNavigate