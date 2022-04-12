const {royaleClient} = require("../../royale/client");
const onSelectMenu = (interaction) => {
    interaction.deferReply({ephemeral: false}).catch(error => {
        console.error(error)
    });
    royaleClient.clanMembers(
        "#LQ8G8J0Q"
    ).then(members => {
        console.log(members)
    })
}

module.exports = onSelectMenu