const {buttonClanMembers} = require("./clan/clan-members");
const {buttonClanInfo} = require("./clan/info");
const {buttonClanRiverRace} = require("./clan/river-race");
const {buttonRiverRaceParticipants} = require("./clan/river-race-participants");

function onClan(interaction, client) {
}

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
        default:
            console.log(interaction.customId)
            break
    }
}

module.exports = onButton