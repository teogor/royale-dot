const {selectMenuMemberInfo} = require("./handlers/info");

const selectMenu = async (client, interaction) => {
    if (interaction.customId === 'select_member_to_25' || interaction.customId === 'select_member_to_50') {
        await selectMenuMemberInfo(client, interaction)
    }
}

module.exports = {
    selectMenu
}