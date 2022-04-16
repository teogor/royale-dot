const {MessageEmbed} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {royaleRepository} = require("../../../royale/repository");
const userRepository = require("../../../database/repository/user-repository");
const {User} = require("../../../database/model/user");
const guildRepository = require("../../../database/repository/guild-repository");

async function getLinkedPlayer(userID, tag) {
    const tagData = await royaleRepository.getTag(tag)
    if (tagData.error) {
        return tagData
    }
    tag = tagData.tag

    const user = await userRepository.getUser(User.fromID(userID))
    // todo check tag availability based on playerID and the relevant tag
    if (user.isLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Check} <@${userID}> is already linked to \`${user.tag}\`!`)
                    // .setDescription(`${Emojis.Check} <@${userID}> is already linked to **${player.linkedName}**(\`${user.tag}\`)!`)
            ],
            ephemeral: true
        }
    }
    user.tag = tag
    return {
        error: false,
        user
    }
}

async function linkPlayer(user) {
    const tag = user.tag
    const playerInfo = await royaleRepository.getPlayer(tag)
    if (playerInfo.error) {
        return playerInfo
    }

    const player = playerInfo.player
    userRepository.linkPlayer(user).catch(error => {
        console.log(error)
    })

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
    guildRepository.getGuild(guildID).then(guild => {
        let roleId = 0
        switch (player.role.type) {
            case 1:
                roleId = guild.roleMemberId
                break
            case 2:
                roleId = guild.roleElderId
                break
            case 3:
                roleId = guild.roleColeaderId
                break
            case 4:
                roleId = guild.roleLeaderId
                break
        }
        let userNickname = interaction.user.username
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            interaction.guild.roles.fetch().then(_ => {
                interaction.guild.roles.cache.forEach(role => {
                    if (roleId === role.id) {
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
                        ` :bookmark_tabs: rank assigned: <@&${roleId}>`
                    )
            ],
            ephemeral: false
        }
        sendFollowUp(interaction, response)
    })
}

function commandPlayerLink(interaction, client) {
    const guildID = interaction.guild.id
    const userID = interaction.user.id
    const tag = interaction.options.getString('tag')

    getLinkedPlayer(userID, tag).then(linkedPlayerData => {
        if (linkedPlayerData.error) {
            sendFollowUp(interaction, linkedPlayerData)
            return
        }
        const {
            user
        } = linkedPlayerData
        linkPlayer(user).then(linkedData => {
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