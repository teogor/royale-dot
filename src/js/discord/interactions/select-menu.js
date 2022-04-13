const {royaleClient} = require("../../royale/client");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../res/values/colors");

const onSelectMenu = (interaction) => {
    console.log(interaction)
    switch (interaction.action) {
        case 'sort_clan_members':
            const guildID = interaction.guild.id
            const args = interaction.arguments

            const sortType = args[0]
            const tag = args[1]
            const page = parseInt(args[2])
            break
    }
    return
    royaleClient.clanMembers(
        "#LQ8G8J0Q"
    ).then(members => {
        const embeds = new MessageEmbed()
            .setColor(ColorsValues.colorBotBlue)
            .setTitle("title")
            .setFooter({
                text: 'Last Updated at'
            })
            .setTimestamp(Date.now())
        console.log(members)
        interaction.update({
            embeds: [embeds]
        }).then(onFinish => {

        }).catch(error => {
            console.error(error)
        })
    })
}

module.exports = onSelectMenu