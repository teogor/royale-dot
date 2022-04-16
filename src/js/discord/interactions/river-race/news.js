const {Emojis} = require("../../../../res/values/emojis");
const {getBadge} = require("../../../../res/values/badges");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../res/values/colors");
const {buildArgs, buildCustomId} = require("../../../utils/custom-builder");

async function showClanRiverRaceInfo(clanRiverRace) {
    const {
        clan,
        details,
        participants
    } = clanRiverRace
    let {
        clans,
        periodType,
        isTraining,
    } = details
    const {
        tag
    } = clan

    let title = ''
    if (periodType === 'warDay') {
        title += `NEWS: River Race | `
    } else if (periodType === 'colloseum') {
        title += `Colloseum | `
    }
    if (isTraining) {
        title += `${Emojis.TrainingDays} Training Day #${clanRiverRace.battleDay}`
    } else {
        title += `Day #${clanRiverRace.battleDay}`
    }
    const fields = []
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
        if (!isTraining) {
            let value = `**Clan Stats:** ${Emojis.Fame} ${c.fame} - ${Emojis.BoatPoints} ${c.periodPoints} - ${Emojis.BoatsAttacked} ${c.attacks.boatAttacks}`
            value += `\n**Participants Stats:** ${Emojis.DecksUsedToday} ${c.attacks.decksUsedToday} (${Emojis.DecksUsed} ${c.attacks.decksUsed}) - ${Emojis.ClanMembers} ${c.attacks.participants} (${Emojis.ClanMembers} ${c.participants.length})`
            fields.push({
                name: `**${currentRank}) ${getBadge(c.badgeId)} __${c.name} (\`${c.tag}\`)__**`,
                value
            })
        }
        currentRank++;
    })
    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(title)
        .setDescription(`**Current Ranking**`)
        .addFields(fields)
        .setFooter({
            text: 'Last Updated at'
        })
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
    isTraining = false
    if (!isTraining) {
        let limit25 = 25
        if (participantsPicker.length < 25) {
            limit25 = participantsPicker.length
        }
        components.push(new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_participant_list_to_25')
                    .setPlaceholder(`Participants List - From 1 To ${limit25} Sorted by Medals`)
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
                        .setCustomId('select_participant_list_to_50')
                        .setPlaceholder(`Participants List - From 26 To ${limit50} Sorted by Medals`)
                        .addOptions(participantsPicker.slice(25, 50)),
                ))
        }
    }
    if (isTraining) {
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

function newsRiverRaceInfo(channel, riverRace) {
    showClanRiverRaceInfo(riverRace).then(followUpMessage => {
        channel.send({
            ...followUpMessage
        }).catch(e => {
            console.log(e)
        })
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    newsRiverRaceInfo
}