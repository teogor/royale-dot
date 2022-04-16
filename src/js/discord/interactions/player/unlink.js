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
    user.tag = tag
    if (!user.isLinked) {
        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`${Emojis.Close} There is no tag linked to this user - <@${userID}>!`)
            ],
            ephemeral: true
        }
    }
    return {
        error: false,
        user
    }
}

async function unlinkPlayer(user) {
    return await userRepository.unlinkPlayer(user)
}

function refreshAccountInfo(interaction, guildID) {
    guildRepository.getGuild(guildID).then(guild => {
        let rolesIDs = [
            guild.roleLeaderId,
            guild.roleColeaderId,
            guild.roleElderId,
            guild.roleMemberId
        ]
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            interaction.guild.roles.cache.filter(role => {
                return rolesIDs.includes(role.id)
            }).forEach(role => {
                interaction.member.roles.remove(role)
            });
            if (interaction.member.id !== interaction.member.guild.ownerId) {
                try {
                    interaction.member.setNickname(`former-${interaction.member.nickname}`).catch(e => {
                        console.log(e)
                    })
                } catch (e) {

                }
            }
        }
    })
}

function commandPlayerUnlink(interaction, client) {
    const guildID = interaction.guildId
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
        if (user.tag !== tag && user.tag !== "#" + tag) {
            const response = {
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(
                            `${Emojis.Close} The tag does not match the one linked to this player!`
                        )
                ],
            }
            sendFollowUp(interaction, response)
        } else {
            unlinkPlayer(user).then(_ => {
                const response = {
                    embeds: [
                        new MessageEmbed()
                            .setColor(ColorsValues.colorBotGreen)
                            .setDescription(
                                `${Emojis.Check} Player unlinked successfully`
                            )
                    ],
                }
                sendFollowUp(interaction, response)
                refreshAccountInfo(interaction, guildID)
            })
        }
    })
}

function autocompletePlayerUnlink(interaction, client) {
    const userID = interaction.user.id
    userRepository.getLinkedPlayer(User.fromID(userID)).then(linkedPlayer => {
        if (linkedPlayer.isLinked) {
            const autocompleteClan = {
                name: `${linkedPlayer.name} (${linkedPlayer.tag})`,
                value: `${linkedPlayer.tag}`
            }
            interaction.respond([autocompleteClan]);
        } else {
            interaction.respond([]);
        }
    })
}

module.exports = {
    commandPlayerUnlink,
    autocompletePlayerUnlink
}