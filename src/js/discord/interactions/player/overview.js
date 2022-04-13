const {royaleRepository} = require("../../../royale/repository");
const {sendFollowUp, sendButtonResponse} = require("../response");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const {Emojis} = require("../../../../res/values/emojis");
const {getBadge} = require("../../../../res/values/badges");
const {buildCustomId} = require("../../../utils/custom-builder");
const {linkedAccountsHandler} = require("../../../database/handle/linked-accounts-handler");

async function getPlayerOverviewInfo(player) {
    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(`${Emojis.UserDetails} ${player.name} (\`${player.tag}\`)`)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .addFields(
            {
                name: `Level`,
                value: `${Emojis.KingLevel} **${player.expLevel}**`,
                inline: true
            },
            {
                name: `Trophies`,
                value: `${Emojis.Trophies} ${player.trophies}`,
                inline: true
            },
            {
                name: `Star Points`,
                value: `${Emojis.GoldenStar} ${player.starPoints}`,
                inline: true
            },
            {
                name: `Clan`,
                value: `${getBadge(player.clan.badgeId)} ${player.clan.name} (\`${player.clan.tag}\`) - rank: ${player.role.nameUp}`
            }
        )

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_player_profile',
                    player.tag
                ))
                .setLabel('Player Profile')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.UserDetails),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_current_river_race_contribution',
                    player.clan.tag,
                    player.tag
                ))
                .setLabel('River Race Contribution')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.ClanWars),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_clan',
                    player.clan.tag
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Clan),
        ))
    const linkedPlayerData = await linkedAccountsHandler.getLinkedData(player.tag)
    if (linkedPlayerData.isLinked) {
        embeds.addFields(
            {
                name: `Linked on Discord`,
                value: `${Emojis.Verified} Player is linked on Discord <@${linkedPlayerData.id}>`
            }
        )
    }
    return {
        embeds: [embeds],
        components
    }
}

function commandPlayerOverview(interaction, client) {
    const guildID = interaction.guildId
    const user = interaction.options.getUser('user')
    const tag = interaction.options.getString('tag')
    const userID = user ? user.id : null
    const playerID = interaction.user.id

    royaleRepository.getPlayerTag(tag, userID, playerID).then(playerTag => {
        if (playerTag.error) {
            return sendFollowUp(interaction, playerTag)
        }

        const tag = playerTag.tag

        royaleRepository.getPlayer(tag).then(playerInfo => {
            if (playerInfo.error) {
                return sendFollowUp(interaction, playerInfo)
            }
            getPlayerOverviewInfo(playerInfo.player).then(playerOverviewInfo => {
                sendFollowUp(interaction, playerOverviewInfo)
            })
        })
    })
}

function buttonPlayerOverview(interaction, client) {
    const tag = interaction.arguments[0]

    royaleRepository.getPlayer(tag).then(playerInfo => {
        if (playerInfo.error) {
            return sendButtonResponse(interaction, playerInfo)
        }

        getPlayerOverviewInfo(playerInfo.player).then(playerProfileInfo => {
            sendButtonResponse(interaction, playerProfileInfo)
        })
    })
}

function selectPlayerOverview(interaction, client) {
    const tag = interaction.handlerData.arguments[0]

    royaleRepository.getPlayer(tag).then(playerInfo => {
        if (playerInfo.error) {
            return sendButtonResponse(interaction, playerInfo)
        }

        getPlayerOverviewInfo(playerInfo.player).then(playerProfileInfo => {
            sendButtonResponse(interaction, playerProfileInfo)
        })
    })
}

module.exports = {
    commandPlayerOverview,
    buttonPlayerOverview,
    selectPlayerOverview
}