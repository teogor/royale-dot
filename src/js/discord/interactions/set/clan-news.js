const {sendFollowUp, sendNew} = require("../response");
const {guildsHandler} = require("../../../database2/handle/guilds-handler");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");

function commandSetClanNews(interaction, client) {
    const channel = interaction.options.getChannel("channel")
    if (channel.type !== "GUILD_TEXT") {
        const followUp = {
            content: `The selected channel must be of text type`
        }
        return sendFollowUp(interaction, followUp)
    }
    guildsHandler.updateClanUpdatesChannel(
        interaction.guild.id,
        channel.id
    )
    const channelTargeted = client.channels.cache.get(channel.id)
    if (channelTargeted !== undefined) {
        const message = {
            embeds: [
                new MessageEmbed()
                    .setTitle(`Clan Updates were binded successfully!`)
                    .setDescription(`From now on this will be the channel where the news from Clan are shown`)
                    .setColor(ColorsValues.colorClanUpdates)
            ],
            ephemeral: false,
        }
        sendNew(channelTargeted, message)
        const response = {
            embeds: [
                new MessageEmbed()
                    .setDescription(`Channel for Clan News set successfully`)
                    .setColor(ColorsValues.colorBotBlue)
            ]
        }
        sendFollowUp(interaction, response)
    }
}

module.exports = {
    commandSetClanNews
}