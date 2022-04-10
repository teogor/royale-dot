const {selectMenuRiverRaceContribution} = require("./handlers/river-race");

const selectMenu = async (client, interaction) => {
    if (interaction.customId === 'select_participants_list_to25' || interaction.customId === 'select_participants_list_to25') {
        await selectMenuRiverRaceContribution(client, interaction)
    }
}

module.exports = {
    selectMenu
}