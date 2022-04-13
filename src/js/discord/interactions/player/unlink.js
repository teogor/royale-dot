const {MessageEmbed, Emoji} = require("discord.js");
const {sendFollowUp} = require("../response");
const {Emojis} = require("../../../../res/values/emojis");
const {linkedClansHandler} = require("../../../database/handle/linked-clans-handler");
const {clansHandler} = require("../../../database/handle/clans-handler");
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

    if (!playerLinked.isLinked) {
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
    return playerLinked
}

async function unlinkPlayer(tag, playerID) {
    return await linkedAccountsHandler.unlinkPlayer(
        playerID,
        tag
    )
}

function refreshAccountInfo(interaction, guildID) {
    guildsHandler.getRoles(guildID).then(roles => {
        let rolesIDs = []
        for (const rolesKey in roles) {
            rolesIDs.push(roles[rolesKey])
        }
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
        if (linkedPlayerData.linkedTag !== tag && linkedPlayerData.linkedTag !== "#" + tag) {
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
            unlinkPlayer(linkedPlayerData.tag, userID).then(_ => {
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
    linkedAccountsHandler.isLinked(userID, "").then(playerLinked => {
        if (playerLinked.isLinked) {
            const autocompleteClan = {
                name: `${playerLinked.linkedName} (${playerLinked.linkedTag})`,
                value: `${playerLinked.linkedTag}`
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