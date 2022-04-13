const {royaleRepository} = require("../../../royale/repository");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed} = require("discord.js");
const {buildCustomId, buildArgs} = require("../../../utils/custom-builder");
const {Emojis} = require("../../../../res/values/emojis");
const {ColorsValues} = require("../../../../res/values/colors");
const {clansHandler} = require("../../../database/handle/clans-handler");
const {sendFollowUp, sendUpdate, sendButtonResponse} = require("../response");

const sortOptionsTypes = [
    'sort_decks_used_today_desc',
    'sort_decks_used_today_asc',
    'sort_decks_used_desc',
    'sort_decks_used_asc',
    'sort_fame_desc',
    'sort_fame_asc',
    'sort_boat_attacks_desc',
    'sort_boat_attacks_asc',
    'sort_name_asc',
    'sort_name_desc',
]

function prepareSortOptions(tag, currentPage) {
    const optionFilterAndSort = []
    optionFilterAndSort.push({
        label: `Decks Used Today (desc)`,
        description: `Sort by the amount of decks used today (desc)`,
        value: buildArgs(
            sortOptionsTypes[0],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Decks Used Today (asc)`,
        description: `Sort by the amount of decks used today (asc)`,
        value: buildArgs(
            sortOptionsTypes[1],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Decks Used (desc)`,
        description: `Sort by the amount of decks used (desc)`,
        value: buildArgs(
            sortOptionsTypes[2],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Decks Used (asc)`,
        description: `Sort by the amount of decks used (asc)`,
        value: buildArgs(
            sortOptionsTypes[3],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Fame (desc)`,
        description: `Sort by the fame (desc)`,
        value: buildArgs(
            sortOptionsTypes[4],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Fame (asc)`,
        description: `Sort by the fame (asc)`,
        value: buildArgs(
            sortOptionsTypes[5],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Boats Attacks (desc)`,
        description: `Sort by the boats attacks (desc)`,
        value: buildArgs(
            sortOptionsTypes[6],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Boats Attacks (asc)`,
        description: `Sort by the boats attacks (asc)`,
        value: buildArgs(
            sortOptionsTypes[7],
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Name (asc)`,
        description: `Sort the members alphabetically (asc)`,
        value: buildArgs(
            sortOptionsTypes[8],
            tag,
            currentPage
        ),
        emoji: Emojis.ClanRankUp,
    })
    optionFilterAndSort.push({
        label: `Name (desc)`,
        description: `Sort the members alphabetically (desc)`,
        value: buildArgs(
            sortOptionsTypes[9],
            tag,
            currentPage
        ),
        emoji: Emojis.ClanRankDown,
    })
    return optionFilterAndSort
}

async function showClanRiverRaceParticipants(
    clanRiverRace,
    sortType,
    currentPage
) {

    const {
        clan,
    } = clanRiverRace
    const tag = clan.tag

    const sortOptions = prepareSortOptions(tag, currentPage)

    sortOptions[sortType].default = true

    const {
        clanMembersSorted,
        reachedTop
    } = clanRiverRace.paginateParticipants(sortType, currentPage)

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('sort_river_race_participants')
                .setPlaceholder('Sort River Race participants')
                .addOptions(sortOptions),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'navigate_river_race_participants_list_previous',
                    sortOptionsTypes[sortType],
                    tag,
                    currentPage - 1
                ))
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Previous)
                .setDisabled(currentPage === 0),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'navigate_river_race_participants_list_next',
                    sortOptionsTypes[sortType],
                    tag,
                    currentPage + 1
                ))
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Next)
                .setDisabled(reachedTop),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_current_river_race',
                    tag
                ))
                .setLabel('River Race')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.ClanWars),
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

    const membersFields = []
    let rank = currentPage * 10 + 1
    clanMembersSorted.forEach(member => {
        membersFields.push({
            name: `${rank}) ${member.name} (\`${member.tag}\`)`,
            value: `**Fame**: ${member.fame} **Decks Used**: ${member.decksUsed} (**Today**: ${member.decksUsedToday}) - **Boats Attacked**: ${member.boatAttacks}`
        })
        rank++
    })

    let embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotGreen)
        .setTitle(`${Emojis.Members} Participants - Page 1`)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .addFields(membersFields)

    const clanDetails = await clansHandler.getDetails(tag)
    if (clanDetails.badgeID !== 0) {
        embeds = embeds
            .setThumbnail(`https://www.deckshop.pro/img/badges/${clanDetails.badgeID}.png`)
    }
    return {
        embeds: [embeds],
        components
    }
}

function commandRiverRaceParticipants(interaction, client) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        showClanRiverRaceParticipants(
            clanRiverRace,
            0,
            0
        ).then(followUpMessage => {
            sendFollowUp(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    })
}

function buttonRiverRaceParticipants(interaction, client) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        showClanRiverRaceParticipants(
            clanRiverRace,
            0,
            0
        ).then(followUpMessage => {
            sendButtonResponse(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    })
}

function sortRiverRaceParticipants(interaction, client) {
    const guildID = interaction.guild.id
    const args = interaction.arguments

    const tag = args[1]
    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }

        const clanRiverRace = clanRiverRaceInfo.clanRiverRace
        const sortType = sortOptionsTypes.indexOf(args[0])
        const currentPage = parseInt(args[2])

        showClanRiverRaceParticipants(
            clanRiverRace,
            sortType,
            currentPage
        ).then(followUpMessage => {
            sendUpdate(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    })
}

function navigateRiverRaceParticipants(interaction, client) {
    const guildID = interaction.guild.id
    const args = interaction.arguments

    const tag = args[1]
    royaleRepository.getClanRiverRace(tag, guildID).then(clanRiverRaceInfo => {
        if (clanRiverRaceInfo.error) {
            sendFollowUp(interaction, clanRiverRaceInfo)
            return
        }

        const clanRiverRace = clanRiverRaceInfo.clanRiverRace
        const sortType = sortOptionsTypes.indexOf(args[0])
        const currentPage = parseInt(args[2])

        showClanRiverRaceParticipants(
            clanRiverRace,
            sortType,
            currentPage
        ).then(followUpMessage => {
            sendUpdate(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    })
}

module.exports = {
    commandRiverRaceParticipants,
    buttonRiverRaceParticipants,
    sortRiverRaceParticipants,
    navigateRiverRaceParticipants
}