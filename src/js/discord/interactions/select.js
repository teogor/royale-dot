const {selectPlayerOverview} = require("./player/overview");
const {selectRiverRaceContribution} = require("./player/river-race-contribution");
const onSelect = (interaction, client) => {
    interaction.deferReply({ephemeral: true}).catch(error => {
        console.error(error)
    });

    switch (interaction.customId) {
        case 'select_member_to_25':
        case 'select_member_to_50':
            selectPlayerOverview(interaction, client)
            break
        case 'select_participant_list_to_25':
        case 'select_participant_list_to_50':
            selectRiverRaceContribution(interaction, client)
            break
        default:
            console.log(interaction.customId)
            break
    }
}

module.exports = onSelect