const {royaleRepository} = require("../../../royale/repository");
const {Emojis} = require("../../../../res/values/emojis");
const {getBadge} = require("../../../../res/values/badges");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const {buildArgs, buildCustomId} = require("../../../utils/custom-builder");
const {sendFollowUp, sendButtonResponse} = require("../response");

async function showClanRiverRaceInfo(clanRiverRace) {
    const {
        clan,
        details,
        participants
    } = clanRiverRace
    const {
        clans,
        periodType,
        isTraining,
    } = details
    const {
        tag
    } = clan

    let title = ''
    if (periodType === 'warDay') {
        title += `River Race | `
    } else if (periodType === 'colloseum') {
        title += `Colloseum | `
    }
    if (isTraining) {
        title += `${Emojis.TrainingDays} Training Day #${clanRiverRace.battleDay}`
    } else {
        title += `Day #${clanRiverRace.battleDay}`
    }
    const fields = []
    let ranking = ""
    let currentRank = 1
    let clansSorted
    if (isTraining) {
        clansSorted = clans.sort((m1, m2) => {
            return m2.attacks.decksUsed - m1.attacks.decksUsed
        })
    } else {
        clansSorted = clans.sort((m1, m2) => {
            return m2.periodPoints - m1.periodPoints
        })
    }
    clansSorted.forEach(c => {
        getBadge(c.badgeId)
        ranking += `**${currentRank}) ${getBadge(c.badgeId)} ${c.name} (\`${c.tag}\`)**`
        ranking += `\n`
        if (!isTraining) {
            ranking += `${c.fame} ${c.periodPoints} ${Emojis.BoatsAttacked} ${c.attacks.decksUsed} (${c.attacks.decksUsedToday})`
            ranking += `\n`
        }
        currentRank++;
    })
    fields.push({
        name: `Current Ranking`,
        value: ranking
    })
    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(title)
        .setFooter({
            text: 'Last Updated at'
        })
        .addFields(fields)
        .setTimestamp(Date.now())

    const participantsPicker = []
    participants.filter(
        participant => participant.decksUsed > 0
    ).sort((m1, m2) => {
        return m2.fame - m1.fame
    }).forEach((participant, rank) => {
        participantsPicker.push({
            label: `#${(rank + 1)} ${participant.name} (${participant.tag})`,
            description: `🏅 ${participant.fame} - ⛵🗡 ${participant.boatAttacks} - 🎴 ${participant.decksUsed} - 🎴📅 ${participant.decksUsedToday}`,
            value: buildArgs(
                tag,
                participant.tag
            ),
            emoji: Emojis.UserDetails,
        })
    })

    const components = []
    if (!isTraining) {
        let limit25 = 25
        if (participantsPicker.length < 25) {
            limit25 = participantsPicker.length
        }
        components.push(new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_participants_list_to25')
                    .setPlaceholder(`Participants List - 1-${limit25} by Medals`)
                    .addOptions(participantsPicker.slice(0, 25)),
            ))
        if (participantsPicker.length > 25) {
            let limit50 = 50
            if (participantsPicker.length < 50) {
                limit50 = participantsPicker.length
            }
            components.push(new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select_participants_list_to50')
                        .setPlaceholder(`Participants List - 26-${limit50} by Medals`)
                        .addOptions(participantsPicker.slice(25, 50)),
                ))
        }
    }
    if (!isTraining) {
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_clan',
                        tag
                    ))
                    .setLabel('Clan')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Clan),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_clan_members',
                        tag
                    ))
                    .setLabel('Members list')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_past_river_races',
                        tag
                    ))
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            ))
    } else {
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_river_race_participants',
                        tag
                    ))
                    .setLabel('Participants')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_clan',
                        tag
                    ))
                    .setLabel('Clan')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Clan),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_clan_members',
                        tag
                    ))
                    .setLabel('Members list')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
            ))
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'button_past_river_races',
                        tag
                    ))
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            ))
    }
    return {
        embeds: [embeds],
        components
    }
}

function commandClanRiverRace(interaction, client) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        showClanRiverRaceInfo(clanRiverRace).then(followUpMessage => {
            sendFollowUp(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}
function buttonClanRiverRace(interaction, client) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        showClanRiverRaceInfo(clanRiverRace).then(followUpMessage => {
            sendButtonResponse(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    commandClanRiverRace,
    buttonClanRiverRace
}