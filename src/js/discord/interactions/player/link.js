const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");
const {linkedAccountsHandler} = require("../../../database/handle/linked-accounts-handler");
const {guildsHandler} = require("../../../database/handle/guilds-handler");

async function getLinkedPlayer(userID, tag) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }
    tag = tagData.tag

    const playerLinked = await linkedAccountsHandler.isLinked(userID, tag)

    if (playerLinked.isLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Check} <@${userID}> is already linked to **${playerLinked.linkedName}**(\`${playerLinked.linkedTag}\`)!`)
            ],
            ephemeral: true
        }
    } else if (playerLinked.isTagLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setDescription(`${Emojis.Close} failed: tag is already linked to another player!`)
            ],
            ephemeral: true
        }
    }
    playerLinked.tag = tag
    return playerLinked
}

async function linkPlayer(tag, userID) {
    const playerInfo = await royaleRepository.getPlayer(tag)
    if (playerInfo.error) {
        return playerInfo
    }

    const player = playerInfo.player

    await linkedAccountsHandler.linkPlayer(userID, player.tag)

    return {
        embeds: [
            new MessageEmbed()
                .setColor(ColorsValues.colorBotGreen)
                .setDescription(`${Emojis.Check} Account linked to **${player.name}**(\`${player.tag}\`)!`)
        ],
        ephemeral: false,
        player
    }
}

function refreshAccountInfo(interaction, guildID, player) {
    guildsHandler.getRoleID(guildID, player.role).then(roleID => {
        let userNickname = interaction.user.username
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            interaction.guild.roles.fetch().then(_ => {
                interaction.guild.roles.cache.forEach(role => {
                    if (roleID.id === role.id) {
                        interaction.member.roles.add(role)
                    }
                });
                if (interaction.member.id !== interaction.member.guild.ownerId) {
                    try {
                        interaction.member.setNickname(player.name).catch(e => {
                            console.log(e)
                        })
                    } catch (e) {

                    }
                }
            })
        }
        const response = {
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(
                        ` :mag_right: username changed from ~~**${userNickname}**~~ to **${player.name}**\n` +
                        ` :bookmark_tabs: rank assigned: <@&${roleID.id}>`
                    )
            ],
            ephemeral: false
        }
        sendFollowUp(interaction, response)
    })
}

function commandPlayerLink(interaction, client) {
    const guildID = interaction.guildId
    const userID = interaction.user.id
    const tag = interaction.options.getString('tag')

    getLinkedPlayer(userID, tag).then(linkedPlayerData => {
        if (linkedPlayerData.error) {
            sendFollowUp(interaction, linkedPlayerData)
            return
        }
        linkPlayer(linkedPlayerData.tag, userID).then(linkedData => {
            sendFollowUp(interaction, linkedData)
            if (!linkedData.error) {
                refreshAccountInfo(interaction, guildID, linkedData.player)
            }
        })
    })
}
module.exports = {
    commandPlayerLink,
}