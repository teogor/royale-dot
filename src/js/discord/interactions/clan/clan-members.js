const {royaleRepository} = require("../../../royale/repository");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed} = require("discord.js");
const {buildCustomId, buildArgs} = require("../../../utils/custom-builder");
const {Emojis} = require("../../../../res/values/emojis");
const {TimestampStyles} = require("@discordjs/builders");
const {ColorsValues} = require("../../../../res/values/colors");
const {clansHandler} = require("../../../database/handle/clans-handler");
const {sendFollowUp, sendUpdate, sendButtonResponse} = require("../response");
const {getKingLevel} = require("../../../../res/values/king-levels");

function parseSortType(sortType) {
    switch (sortType) {
        case 'sort_rank_desc':
            return 1
        case 'sort_rank_asc':
            return 2
        case 'sort_exp_level_asc':
            return 3
        case 'sort_exp_level_desc':
            return 4
        case 'sort_weekly_donations_asc':
            return 5
        case 'sort_weekly_donations_desc':
            return 6
        case 'sort_weekly_donations_received_asc':
            return 7
        case 'sort_weekly_donations_received_desc':
            return 8
        case 'sort_last_seen_desc':
            return 9
        case 'sort_last_seen_asc':
            return 10
        case 'sort_name_desc':
            return 11
        case 'sort_name_asc':
            return 12
        default:
            return 0
    }
}

function getSortType(sortType) {
    switch (sortType) {
        case 1:
            return 'sort_rank_desc';
        case 2:
            return 'sort_rank_asc';
        case 3:
            return 'sort_exp_level_asc';
        case 4:
            return 'sort_exp_level_desc';
        case 5:
            return 'sort_weekly_donations_asc';
        case 6:
            return 'sort_weekly_donations_desc';
        case 7:
            return 'sort_weekly_donations_received_asc';
        case 8:
            return 'sort_weekly_donations_received_desc';
        case 9:
            return 'sort_last_seen_desc';
        case 10:
            return 'sort_last_seen_asc';
        case 11:
            return 'sort_name_desc';
        case 12:
            return 'sort_name_asc';
        default:
            return ''
    }
}

function prepareSortOptions(tag, currentPage) {
    const optionFilterAndSort = []
    optionFilterAndSort.push({
        label: `Rank (desc)`,
        description: `Sort by the rank of the member (desc)`,
        value: buildArgs(
            getSortType(1),
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Rank (asc)`,
        description: `Sort by the rank of the member (asc)`,
        value: buildArgs(
            getSortType(2),
            tag,
            currentPage
        ),
        emoji: Emojis.Trophies,
    })
    optionFilterAndSort.push({
        label: `Exp Level (desc)`,
        description: `Sort by the king level of member (desc)`,
        value: buildArgs(
            getSortType(3),
            tag,
            currentPage
        ),
        emoji: Emojis.KingLevel,
    })
    optionFilterAndSort.push({
        label: `Exp Level (asc)`,
        description: `Sort by the king level of member (asc)`,
        value: buildArgs(
            getSortType(4),
            tag,
            currentPage
        ),
        emoji: Emojis.KingLevel,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations (desc)`,
        description: `Sort by the amount of donations done in the last week (desc)`,
        value: buildArgs(
            getSortType(5),
            tag,
            currentPage
        ),
        emoji: Emojis.CardsDonated,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations (asc)`,
        description: `Sort by the amount of donations done in the last week (asc)`,
        value: buildArgs(
            getSortType(6),
            tag,
            currentPage
        ),
        emoji: Emojis.CardsDonated,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations Received (desc)`,
        description: `Sort by the amount of donations received in the last week (desc)`,
        value: buildArgs(
            getSortType(7),
            tag,
            currentPage
        ),
        emoji: Emojis.CardsReceived,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations Received (asc)`,
        description: `Sort by the amount of donations received in the last week (asc)`,
        value: buildArgs(
            getSortType(8),
            tag,
            currentPage
        ),
        emoji: Emojis.CardsReceived,
    })
    optionFilterAndSort.push({
        label: `Last Seen (desc)`,
        description: `Sort by the last time the member was online (desc)`,
        value: buildArgs(
            getSortType(9),
            tag,
            currentPage
        ),
        emoji: Emojis.LastSeen,
    })
    optionFilterAndSort.push({
        label: `Last Seen (asc)`,
        description: `Sort by the last time the member was online (asc)`,
        value: buildArgs(
            getSortType(10),
            tag,
            currentPage
        ),
        emoji: Emojis.LastSeen,
    })
    optionFilterAndSort.push({
        label: `Name (desc)`,
        description: `Sort the members alphabetically (desc)`,
        value: buildArgs(
            getSortType(11),
            tag,
            currentPage
        ),
        emoji: Emojis.ClanRankUp,
    })
    optionFilterAndSort.push({
        label: `Name (asc)`,
        description: `Sort the members alphabetically (asc)`,
        value: buildArgs(
            getSortType(12),
            tag,
            currentPage
        ),
        emoji: Emojis.ClanRankDown,
    })
    return optionFilterAndSort
}

async function showClanMembers(
    tag,
    sortType,
    currentPage,
    clanMembers
) {

    const sortOptions = prepareSortOptions(tag, currentPage)
    sortOptions[sortType - 1].default = true

    const {
        clanMembersSorted,
        reachedTop
    } = clanMembers.paginate(sortType, currentPage)

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('sort_clan_members')
                .setPlaceholder('Sort clan members')
                .addOptions(sortOptions),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'navigate_members_list_previous',
                    getSortType(sortType),
                    tag,
                    currentPage - 1
                ))
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Previous)
                .setDisabled(currentPage === 0),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'navigate_members_list_next',
                    getSortType(sortType),
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
                    'button_clan',
                    tag
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.Clan),
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
        const differenceRank = member.clanRank - member.previousClanRank
        let rankString = `${member.clanRank}`
        if (differenceRank > 0) {
            rankString += ` - ${differenceRank}${Emojis.ClanRankUp}`
        } else if (differenceRank < 0) {
            rankString += ` - ${-differenceRank}${Emojis.ClanRankDown}`
        }
        membersFields.push({
            name: `${rank}) ${member.name} (\`${member.tag}\`)`,
            value:
                `${member.role.nameUp} (#${rankString}) - ${getKingLevel(member.expLevel)} - ${Emojis.Trophies} ${member.trophies}\n` +
                `${Emojis.LastSeen} <t:${member.lastSeen / 1000}:${TimestampStyles.ShortDateTime}> (<t:${member.lastSeen / 1000}:${TimestampStyles.RelativeTime}>)` +
                `\n${Emojis.CardsDonated} ${member.donations} - ${Emojis.CardsReceived} ${member.donationsReceived} - ${member.arena.name}`
        })
        rank++
    })

    let embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotGreen)
        .setTitle(`${Emojis.Members} Clan members ${clanMembers.total}/50`)
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

function commandClanMembers(interaction, client) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    royaleRepository.getClanMembers(tag, guildID).then(clanMembersInfo => {
        if (clanMembersInfo.error) {
            sendFollowUp(interaction, clanMembersInfo)
            return
        }

        const tag = clanMembersInfo.tag
        const clanMembers = clanMembersInfo.members

        showClanMembers(
            tag,
            1,
            0,
            clanMembers
        ).then(followUpMessage => {
            sendFollowUp(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

function buttonClanMembers(interaction, client) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    royaleRepository.getClanMembers(tag, guildID).then(clanMembersInfo => {
        if (clanMembersInfo.error) {
            sendFollowUp(interaction, clanMembersInfo)
            return
        }

        const tag = clanMembersInfo.tag
        const clanMembers = clanMembersInfo.members

        showClanMembers(
            tag,
            1,
            0,
            clanMembers
        ).then(followUpMessage => {

            sendButtonResponse(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

function sortClanMembers(interaction, client) {
    const guildID = interaction.guild.id
    const args = interaction.arguments

    const tag = args[1]
    royaleRepository.getClanMembers(tag, guildID).then(clanMembersInfo => {
        if (clanMembersInfo.error) {
            sendFollowUp(interaction, clanMembersInfo)
            return
        }

        const tag = clanMembersInfo.tag
        const clanMembers = clanMembersInfo.members
        const sortType = parseSortType(args[0])
        const currentPage = parseInt(args[2])

        showClanMembers(
            tag,
            sortType,
            currentPage,
            clanMembers
        ).then(followUpMessage => {
            sendUpdate(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

function navigateClanMembers(interaction, client) {
    const guildID = interaction.guild.id
    const args = interaction.arguments

    const tag = args[1]
    royaleRepository.getClanMembers(tag, guildID).then(clanMembersInfo => {
        if (clanMembersInfo.error) {
            sendFollowUp(interaction, clanMembersInfo)
            return
        }

        const tag = clanMembersInfo.tag
        const clanMembers = clanMembersInfo.members
        const sortType = parseSortType(args[0])
        const targetedPage = parseInt(args[2])

        showClanMembers(
            tag,
            sortType,
            targetedPage,
            clanMembers
        ).then(followUpMessage => {
            sendUpdate(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    commandClanMembers,
    sortClanMembers,
    navigateClanMembers,
    buttonClanMembers
}