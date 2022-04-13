const {buttonClanMembers} = require("./clan/clan-members");
const {buttonClanInfo} = require("./clan/info");
const {buttonClanRiverRace} = require("./clan/river-race");
const {buttonRiverRaceParticipants} = require("./clan/river-race-participants");
const {buttonPlayerProfile} = require("./player/profile");
const {buttonPlayerOverview} = require("./player/overview");
const {buttonRiverRaceContribution} = require("./player/river-race-contribution");

const onButton = (interaction, client) => {
    const components = interaction.customId.split(" ")
    interaction.customId = components[0]
    interaction.arguments = components[1].split("-").slice(1)

    interaction.deferReply({ephemeral: true}).catch(error => {
        console.error(error)
    });

    switch (interaction.customId) {
        case 'button_clan_members':
            buttonClanMembers(interaction, client)
            break
        case 'button_clan':
            buttonClanInfo(interaction, client)
            break
        case 'button_current_river_race':
            buttonClanRiverRace(interaction, client)
            break
        case 'button_river_race_participants':
            buttonRiverRaceParticipants(interaction, client)
            break
        case 'button_player_profile':
            buttonPlayerProfile(interaction, client)
            break
        case 'button_player_overview':
            buttonPlayerOverview(interaction, client)
            break
        case 'button_current_river_race_contribution':
            buttonRiverRaceContribution(interaction, client)
            break
        default:
            console.log(interaction.customId)
            break
    }
}

module.exports = onButton