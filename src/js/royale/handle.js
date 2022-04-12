const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../res/values/colors");
const {isValidTag} = require("../utils/validate");
const {clansHandler} = require("../database/handle/clans-handler");

async function handleError(error) {
    const {
        reason,
        args
    } = error
    const {
        interaction,
        tag
    } = args
    if (reason === "notFound") {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setTitle("Invalid Clan Tag")
                    .setDescription(
                        "No clan was found with the following tag: **" +
                        tag.replaceAll("%23", "") + "**"
                    )
            ]
        })
    } else if (reason === "accessDenied") {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setTitle("Error")
                    .setDescription("Something went wrong. Please try again later :(")
            ]
        })
    }
}

function checkForErrors(data, args) {
    if (data.reason === "notFound" || data.reason === "accessDenied") {
        handleError({
            reason: data.reason,
            args
        }).catch(error => {
            console.error(error)
        })
        return true
    }
    return false
}

async function getClanInfo({interaction, tag}) {
    if (!tag.startsWith('#')) {
        tag = '#' + tag
    }

    if (!isValidTag(tag)) {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setDescription(
                        `An invalid tag was provided!\n` +
                        `These are the valid characters for a tag: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V`
                    )
            ],
            ephemeral: true
        })
        return {
            clan: undefined
        }
    }

    tag = tag.replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const data = await fetchClanInfo(tag)
    if (checkForErrors(data, {interaction, tag})) {
        return {
            clan: undefined
        }
    }

    return {
        clan: data
    }

}

module.exports = {
    getClanInfo
}