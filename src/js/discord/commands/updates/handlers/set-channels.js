const discordClient = require("../../../client");
const {guildsHandler} = require("../../../../database/handle/guilds-handler");
const {MessageEmbed} = require("discord.js");
const {getBadge} = require("../../../../../res/values/badges");
const {ColorsValues} = require("../../../../../res/values/colors");

async function setClanUpdatesChannel(client, interaction) {
    const channel = interaction.options.getChannel("channel")
    if (channel.type !== "GUILD_TEXT") {
        await interaction.followUp({
            content: `The selected channel must be of text type`
        })
        return
    }
    await guildsHandler.updateClanUpdatesChannel(interaction.guild.id, channel.id)
    await interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setTitle(`Clan Updates were binded successfully!`)
                .setDescription(`From now on this will be the channel where the updates from clan are shown`)
                .setColor(ColorsValues.colorClanUpdates)
        ],
        ephemeral: false,
    })
}

async function setRiverRaceUpdatesChannel(client, interaction) {
    const channel = interaction.options.getChannel("channel")
    if (channel.type !== "GUILD_TEXT") {
        await interaction.followUp({
            content: `The selected channel must be of text type`
        })
        return
    }
    await guildsHandler.updateRiverRaceUpdatesChannel(interaction.guild.id, channel.id)
    await interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setTitle(`River Race Updates were binded successfully!`)
                .setDescription(`From now on this will be the channel where the updates from river race are shown`)
                .setColor(ColorsValues.colorRiverRaceUpdates)
        ],
        ephemeral: false,
    })
}

module.exports = {
    setClanUpdatesChannel,
    setRiverRaceUpdatesChannel
}