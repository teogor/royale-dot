const {sendFollowUp, sendNew} = require("../response");
const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const guildRepository = require("../../../database/repository/guild-repository");
const {Guild} = require("../../../database/model/guild");

function commandSetClanNewsChannel(interaction, client) {
    const channel = interaction.options.getChannel("channel")
    if (channel.type !== "GUILD_TEXT") {
        const followUp = {
            content: `The selected channel must be of text type`
        }
        return sendFollowUp(interaction, followUp)
    }
    const guild = Guild.fromID(interaction.guildId)
    guild.channelClanNewsId = channel.id
    guildRepository.setClanNewsChannels(guild).catch(error => {
        console.log(error)
    })
    const channelTargeted = client.channels.cache.get(channel.id)
    if (channelTargeted !== undefined) {
        const message = {
            embeds: [
                new MessageEmbed()
                    .setTitle(`Clan News channel was linked successfully!`)
                    .setDescription(`In the feature, the notifications from \`Clan\` will appear on this channel`)
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
    commandSetClanNewsChannel
}