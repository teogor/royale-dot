const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {env} = require("../../../../env");
const {buildCustomId, buildArgs} = require("../../../../utils/custom-builder");
const {EmojisValues} = require("../../../../../res/values/emojis");
const {TimestampStyles} = require("@discordjs/builders");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function buttonCurrentRiverRace(client, interaction) {
    const tag = interaction.arguments[0].replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const {
        riverRace,
        error,
        reason
    } = await fetchRiverRaceInfo(tag)

    if (error) {
        if (reason === "notFound") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Invalid Clan Tag")
                        .setDescription(
                            "No clan was found with the following tag: **" +
                            tag.replaceAll("%23", "#") + "**"
                        )
                ],
                ephemeral: true
            })
        } else if (reason === "accessDenied") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Error")
                        .setDescription(
                            "Something went wrong. Please try again later"
                        )
                ],
                ephemeral: true
            })
        }
        return
    }

    const {
        components,
        embeds
    } = await prepareRiverRaceInfo(riverRace, tag)

    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

async function prepareRiverRaceInfo(riverRace, tag) {
    let title = `River Race | `

    let currentDay = 0
    switch (riverRace.periodType) {
        case "training":
            title += `Battle Day ${riverRace.periodIndex + 1} (Training)`
            break
        case "warDay":
            title += `Battle Day ${riverRace.periodIndex - 2} (War)`
            currentDay = riverRace.periodIndex - 3
            break
        case "colloseum":
            title += `Battle Day ${riverRace.periodIndex - 2} (Colloseum)`
            currentDay = riverRace.periodIndex - 3
            break
    }
    const {clans} = riverRace.battleDays[currentDay]
    const fields = []
    let ranking = ""
    let currentRank = 1
    clans.sort((m1, m2) => {
        return m2.periodPoints - m1.periodPoints
    }).forEach(c => {
        const clan = riverRace.clans.filter((i) => {
            return i.tag === c.clan
        })[0]
        ranking += `${currentRank}) ${clan.name} (${clan.tag})`
        ranking += `\n`
        ranking += `${c.fame} ${c.periodPoints} ${c.attacks.used} (${c.attacks.decksUsed})`
        ranking += `\n`
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
    riverRace.participants
        .sort((m1, m2) => {
            return m2.fame - m1.fame
        })
        .forEach((participant, rank) => {
            participantsPicker.push({
                label: `#${(rank + 1)} ${participant.name} (${participant.tag})`,
                description: `🏅 ${participant.fame} - ⛵🗡 ${participant.boatAttacks} - 🎴 ${participant.decksUsed} - 🎴📅 ${participant.decksUsedToday}`,
                value: buildArgs(
                    tag.replaceAll("%23", "#"),
                    participant.tag
                ),
                emoji: EmojisValues.Info,
            })
        })

    const components = []
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
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_clan',
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_members_list',
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('Members list')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_past_wars',
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('Past Wars')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        ))
    return {
        embeds,
        components
    }
}

async function selectMenuRiverRaceContribution(client, interaction) {
    const clanTag = interaction.arguments[0].replaceAll("#", "%23").trim().toUpperCase()
    const userTag = interaction.arguments[1]

    const {
        riverRace,
        error,
        reason
    } = await fetchRiverRaceInfo(clanTag)

    if (error) {
        if (reason === "notFound") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Invalid Clan Tag")
                        .setDescription(
                            "No clan was found with the following tag: **" +
                            clanTag.replaceAll("%23", "#") + "**"
                        )
                ],
                ephemeral: true
            })
        } else if (reason === "accessDenied") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Error")
                        .setDescription(
                            "Something went wrong. Please try again later"
                        )
                ],
                ephemeral: true
            })
        }
        return
    }

    const {
        components,
        embeds
    } = await prepareRiverRaceContribution(riverRace, clanTag, userTag)

    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

async function buttonRiverRaceContribution(client, interaction) {
    const clanTag = interaction.arguments[0].replaceAll("#", "%23").trim().toUpperCase()
    const userTag = interaction.arguments[1]

    const {
        riverRace,
        error,
        reason
    } = await fetchRiverRaceInfo(clanTag)

    if (error) {
        if (reason === "notFound") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Invalid Clan Tag")
                        .setDescription(
                            "No clan was found with the following tag: **" +
                            clanTag.replaceAll("%23", "#") + "**"
                        )
                ],
                ephemeral: true
            })
        } else if (reason === "accessDenied") {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setTitle("Error")
                        .setDescription(
                            "Something went wrong. Please try again later"
                        )
                ],
                ephemeral: true
            })
        }
        return
    }

    const {
        components,
        embeds
    } = await prepareRiverRaceContribution(riverRace, clanTag, userTag)

    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

async function prepareRiverRaceContribution(riverRace, clanTag, userTag) {
    let title = `River Race | `

    let currentDay = 0
    switch (riverRace.periodType) {
        case "training":
            title += `Battle Day ${riverRace.periodIndex + 1} (Training)`
            break
        case "warDay":
            title += `Battle Day ${riverRace.periodIndex - 2} (War)`
            currentDay = riverRace.periodIndex - 3
            break
        case "colloseum":
            title += `Battle Day ${riverRace.periodIndex - 2} (Colloseum)`
            currentDay = riverRace.periodIndex - 3
            break
    }

    const players = riverRace.participants.filter((player) => {
        return player.tag === userTag
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
    const player = players[0]
    console.log(player)

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(`${player.name} (${player.tag}) | River Race Contributions`)
        .setFooter({
            text: 'Last Updated at'
        })
        .addFields([
            {
                name: `Fame`,
                value: `${player.fame}`
            },
            {
                name: `Decks Used`,
                value: `Today: ${player.decksUsedToday}/4 (Overall: ${player.decksUsed}/${(riverRace.periodIndex+1)*4})`
            }
        ])
        .setTimestamp(Date.now())

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_clan',
                    clanTag.replaceAll("%23", "#")
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_members_list',
                    clanTag.replaceAll("%23", "#")
                ))
                .setLabel('Members list')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_past_wars',
                    clanTag.replaceAll("%23", "#")
                ))
                .setLabel('Past Wars')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        ))
    return {
        embeds,
        components
    }
}

async function fetchRiverRaceInfo(clanTag) {
    const reqUrl = `https://api.clashroyale.com/v1/clans/${clanTag}/currentriverrace`
    xhr.open("GET", reqUrl, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("authorization", `Bearer ${env.ROYALE_API}`);
    xhr.send();
    await xhr.responseText;
    const result = JSON.parse(xhr.responseText);

    if (result.reason === "notFound" || result.result === "accessDenied") {
        return {
            riverRace: null,
            error: true,
            reason: result.reason
        }
    }
    const battleDays = []
    result.periodLogs.forEach(period => {
        const clans = []
        period.items.forEach(clan => {
            clans.push({
                clan: clan.clan.tag,
                pointsEarned: clan.pointsEarned,
                progressStartOfDay: clan.progressStartOfDay,
                progressEndOfDay: clan.progressEndOfDay,
                endOfDayRank: clan.endOfDayRank,
                progressEarned: clan.progressEarned,
                numOfDefensesRemaining: clan.numOfDefensesRemaining,
                progressEarnedFromDefenses: clan.progressEarnedFromDefenses
            })
        })
        battleDays.push({
            day: period.periodIndex - 2,
            clans
        })
    })
    const clansCD = []
    const participants = []
    result.clans.forEach(clan => {
        let attacks = {
            used: 0,
            decksUsed: 0
        }
        if (clan.tag === clanTag.replaceAll("%23", "#")) {
            clan.participants.forEach(participant => {
                if (participant.decksUsedToday > 0) {
                    attacks.decksUsed += participant.decksUsedToday
                    attacks.used += 1
                }
                participants.push({
                    tag: participant.tag,
                    name: participant.name,
                    fame: participant.fame,
                    repairPoints: participant.repairPoints,
                    boatAttacks: participant.boatAttacks,
                    decksUsed: participant.decksUsed,
                    decksUsedToday: participant.decksUsedToday
                })
            })
        } else {
            clan.participants.forEach(participant => {
                if (participant.decksUsedToday > 0) {
                    attacks.decksUsed += participant.decksUsedToday
                    attacks.used += 1
                }
            })
        }
        clansCD.push({
            clan: clan.tag,
            fame: clan.fame,
            periodPoints: clan.periodPoints,
            attacks
        })
    })
    battleDays.push({
        day: result.periodIndex - 2,
        clans: clansCD
    })
    const clans = []
    result.clans.forEach(clan => {
        clans.push({
            tag: clan.tag,
            name: clan.name,
            badgeId: clan.badgeId,
            fame: clan.fame,
        })
    })
    const riverRace = {
        periodType: result.periodType,
        periodIndex: result.periodIndex,
        battleDays,
        clans,
        participants
    }
    return {
        riverRace,
        error: false
    }
}

module.exports = {
    buttonCurrentRiverRace,
    buttonRiverRaceContribution,
    selectMenuRiverRaceContribution
}