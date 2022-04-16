const {royaleRepository} = require("../../../royale/repository");
const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {buildCustomId, buildArgs} = require("../../../utils/custom-builder");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {sendFollowUp} = require("../response");

async function showPlayerRiverRaceContribution(player, clanRiverRace) {

    const {
        participants
    } = clanRiverRace

    const players = participants.filter((player) => {
        return player.tag === player.tag
    })
    if (players.length === 0) {
        const embeds = new MessageEmbed()
            .setColor(ColorsValues.colorBotRed)
            .setDescription('Something went wrong')

        const components = []
        return {
            embeds,
            components
        }
    }
    const playerContribution = players[0]
    let title = `${player.name}'s Contribution (Tag - \`${player.tag}\`)`

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(title)
        .setFooter({
            text: 'Last Updated at'
        })
        .addFields([
            {
                name: `Total Decks Used`,
                value: `${Emojis.DecksUsed} ${playerContribution.decksUsed}`,
                inline: true
            },
            {
                name: `Remaining Decks`,
                value: `${Emojis.DecksUsedToday} ${4-playerContribution.decksUsedToday}/4`,
                inline: true
            },
            {
                name: `Decks Used Today`,
                value: `${Emojis.DecksUsedToday} ${playerContribution.decksUsedToday}`,
                inline: true
            },
            {
                name: `Fame`,
                value: `${Emojis.Fame} ${playerContribution.fame}`,
                inline: true
            },
            {
                name: `Boats Attacked`,
                value: `${Emojis.BoatBattle} ${playerContribution.boatAttacks}`,
                inline: true
            }
        ])
        .setTimestamp(Date.now())

    const clanTag = player.clan.tag
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
                    'button_player_profile',
                    player.tag
                ))
                .setLabel('Player Profile')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.UserDetails),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_river_race_participants',
                    clanTag
                ))
                .setLabel('Participants')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.ClanMembers),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_clan',
                    clanTag
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Clan),
        ))

    return {
        embeds: [embeds],
        components
    }
}

function commandRiverRaceContribution(interaction, client) {
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

            const player = playerInfo.player

            royaleRepository.getClanRiverRace(player.clan.tag).then(clanRiverRaceInfo => {
                if (clanRiverRaceInfo.error) {
                    sendFollowUp(interaction, clanRiverRaceInfo)
                    return
                }

                const clanRiverRace = clanRiverRaceInfo.clanRiverRace
                showPlayerRiverRaceContribution(
                    player,
                    clanRiverRace
                ).then(followUpMessage => {
                    sendFollowUp(interaction, followUpMessage)
                }).catch(error => {
                    console.log(error)
                })
            })
        })
    })
}

function buttonRiverRaceContribution(interaction, client) {
    const userTag = interaction.arguments[1]

    royaleRepository.getPlayer(userTag).then(playerInfo => {
        if (playerInfo.error) {
            return sendFollowUp(interaction, playerInfo)
        }

        const player = playerInfo.player

        royaleRepository.getClanRiverRace(player.clan.tag).then(clanRiverRaceInfo => {
            if (clanRiverRaceInfo.error) {
                sendFollowUp(interaction, clanRiverRaceInfo)
                return
            }

            const clanRiverRace = clanRiverRaceInfo.clanRiverRace
            showPlayerRiverRaceContribution(
                player,
                clanRiverRace
            ).then(followUpMessage => {
                sendFollowUp(interaction, followUpMessage)
            }).catch(error => {
                console.log(error)
            })
        })
    })
}


function selectRiverRaceContribution(interaction, client) {
    const userTag = interaction.handlerData.arguments[1]

    royaleRepository.getPlayer(userTag).then(playerInfo => {
        if (playerInfo.error) {
            return sendFollowUp(interaction, playerInfo)
        }

        const player = playerInfo.player

        royaleRepository.getClanRiverRace(player.clan.tag).then(clanRiverRaceInfo => {
            if (clanRiverRaceInfo.error) {
                sendFollowUp(interaction, clanRiverRaceInfo)
                return
            }

            const clanRiverRace = clanRiverRaceInfo.clanRiverRace
            showPlayerRiverRaceContribution(
                player,
                clanRiverRace
            ).then(followUpMessage => {
                sendFollowUp(interaction, followUpMessage)
            }).catch(error => {
                console.log(error)
            })
        })
    })
}

module.exports = {
    commandRiverRaceContribution,
    buttonRiverRaceContribution,
    selectRiverRaceContribution
}