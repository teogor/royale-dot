const {sortMembers} = require("./handlers/members");

const filter = async (client, interaction) => {
    if (interaction.customId === 'sort_clan_members' || interaction.customId === 'sort_members_list_next' || interaction.customId === 'sort_members_list_previous') {
        await sortMembers(client, interaction)
    }
}

module.exports = {
    filter
}