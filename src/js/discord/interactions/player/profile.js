const {royaleRepository} = require("../../../royale/repository");
const {sendFollowUp, sendButtonResponse} = require("../response");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const {Emojis} = require("../../../../res/values/emojis");
const {getBadge} = require("../../../../res/values/badges");
const {buildCustomId} = require("../../../utils/custom-builder");
const {linkedAccountsHandler} = require("../../../database/handle/linked-accounts-handler");
const {getKingLevel} = require("../../../../res/values/king-levels");

async function getPlayerProfileInfo(player) {
    let link = "https://link.clashroyale.com/deck/en?deck="
    let battleDeckDescription = ""
    player.currentDeck.forEach(card => {
        battleDeckDescription += `**${card.name}** (Lvl. ${card.level}), `
        link += `${card.id};`
    })
    battleDeckDescription = battleDeckDescription.slice(0, -2)
    link = link.slice(0, -1)
    link += `&id=${player.tag.replaceAll("#", "")}`
    battleDeckDescription += ` ([Copy It!](${link}))`

    let badgesDescription = ""
    player.badges.forEach(badge => {
        const content = `**${badge.name}** (Lvl. ${badge.level}/${badge.maxLevel}), `
        if (badgesDescription.length + content.length < 1024) {
            badgesDescription += content
        }
    })
    badgesDescription = badgesDescription.slice(0, -2)

    const fields = []
    fields.push(
        {
            name: `King Level`,
            value: `${getKingLevel(player.expLevel)} (${Emojis.XP} **${player.expPoints}** XP)`,
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
        },
        {
            name: `BattleDeck`,
            value: `${battleDeckDescription}`
        }
    )
    if (player.leagueStatistics !== undefined) {
        fields.push(
            {
                name: `Current Season Highest`,
                value: `${Emojis.Trophies} ${player.leagueStatistics.currentSeason.bestTrophies}`,
                inline: true
            },
            {
                name: `Previous Season`,
                value: `${Emojis.Trophies} ${player.leagueStatistics.previousSeason.bestTrophies}`,
                inline: true
            },
            {
                name: `Best Season`,
                value: `${Emojis.Trophies} ${player.leagueStatistics.bestSeason.trophies}`,
                inline: true
            }
        )
    }
    const totalBattles = player.wins + player.losses
    const percentWins = (player.wins * 100 / totalBattles).toFixed(2)
    const percentLosses = (player.losses * 100 / totalBattles).toFixed(2)
    const percentThreeCrownWins = (player.threeCrownWins * 100 / player.wins).toFixed(2)

    fields.push(
        {
            name: `Wins`,
            value: `${Emojis.CrownBlue} ${player.wins} (${percentWins}%)`,
            inline: true
        },
        {
            name: `Three Crown Wins`,
            value: `${Emojis.CrownBlue}${Emojis.CrownBlue}${Emojis.CrownBlue} ${player.threeCrownWins} (${percentThreeCrownWins}%)`,
            inline: true
        },
        {
            name: `Losses`,
            value: `${Emojis.CrownRed} ${player.losses} (${percentLosses}%)`,
            inline: true
        },
    )

    fields.push(
        {
            name: `Total Battles`,
            value: `${Emojis.Battles} ${player.battleCount}`,
            inline: true
        },
        {
            name: `Highest Trophies`,
            value: `${Emojis.Trophies} ${player.bestTrophies}`,
            inline: true
        },
        {
            name: `Cards Found`,
            value: `${Emojis.CardsFound} ${player.cards.length}/107`,
            inline: true
        },
    )

    fields.push(
        {
            name: `Weekly (W) Donations`,
            value: `${Emojis.CardsDonated} ${player.donations}`,
            inline: true
        },
        {
            name: `(W) Donations Received`,
            value: `${Emojis.CardsReceived} ${player.donationsReceived}`,
            inline: true
        },
        {
            name: `Total Donations`,
            value: `${Emojis.CardsDonated} ${player.totalDonations}`,
            inline: true
        },
    )

    const favouriteLevel = player.cards.filter(
        card => card.id === player.currentFavouriteCard.id
    )[0]

    fields.push(
        {
            name: `Current Favourite Card`,
            value: `${favouriteLevel.name}`,
            inline: false
        },
    )

    fields.push(
        {
            name: `Badges`,
            value: `${badgesDescription}`,
            inline: false
        },
    )

    fields.push(
        {
            name: `Challenge Stats`,
            value: `**Max Wins**: ${player.challengeMaxWins}\n**Cards Won**: ${player.challengeCardsWon}`,
            inline: true
        },
        {
            name: `Tournament Stats`,
            value: `**Matches Played**: ${player.tournamentBattleCount}\n**Cards Won**: ${player.tournamentCardsWon}`,
            inline: true
        },
    )

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(`${Emojis.UserDetails} ${player.name} (\`${player.tag}\`)`)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .addFields(fields)

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_player_overview',
                    player.tag
                ))
                .setLabel('Player Overview')
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

function commandPlayerProfile(interaction, client) {
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

            getPlayerProfileInfo(playerInfo.player).then(playerProfileInfo => {
                sendFollowUp(interaction, playerProfileInfo)
            })
        })
    })
}

function buttonPlayerProfile(interaction, client) {
    const tag = interaction.arguments[0]


    royaleRepository.getPlayer(tag).then(playerInfo => {
        if (playerInfo.error) {
            return sendButtonResponse(interaction, playerInfo)
        }

        getPlayerProfileInfo(playerInfo.player).then(playerProfileInfo => {
            sendButtonResponse(interaction, playerProfileInfo)
        })
    })
}

module.exports = {
    commandPlayerProfile,
    buttonPlayerProfile
}