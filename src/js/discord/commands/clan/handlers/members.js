const {env} = require("../../../../env");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {EmojisValues} = require("../../../../../res/values/emojis");
const {TimestampStyles} = require("@discordjs/builders");
const {buildArgs, buildCustomId} = require("../../../../utils/custom-builder");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function buttonMembers(client, interaction) {
    const tag = interaction.arguments[0]

    const {
        clanMembers,
        error,
        reason
    } = await fetchMembersList(tag.replaceAll("#", "%23"))

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
    } = await prepareMembersList(clanMembers, tag, 1)

    await interaction.followUp({
        embeds: [embeds],
        components
    })

}

async function sortMembers(client, interaction) {
    const args = interaction.arguments

    const sortType = args[0]
    const tag = args[1]
    const page = args[2]

    const {
        clanMembers,
        error
    } = await fetchMembersList(tag.replaceAll("#", "%23"))

    if (error) {
        return
    }

    const {
        components,
        embeds
    } = await prepareMembersList(clanMembers, tag, parseSortType(sortType), parseInt(page))

    await interaction.update({
        embeds: [embeds],
        components
    })
}

function prepareClanMembers(clanMembers, sortType, page) {
    clanMembers = clanMembers.sort((m1, m2) => {
        switch (sortType) {
            case 1:
                return m1.clanRank - m2.clanRank;
            case 2:
                return m2.clanRank - m1.clanRank;
            case 3:
                return m2.expLevel - m1.expLevel;
            case 4:
                return m1.expLevel - m2.expLevel;
            case 5:
                return m2.donations - m1.donations;
            case 6:
                return m1.donations - m2.donations;
            case 7:
                return m2.donationsReceived - m1.donationsReceived;
            case 8:
                return m1.donationsReceived - m2.donationsReceived;
            case 9:
                return m1.lastSeen - m2.lastSeen;
            case 10:
                return m2.lastSeen - m1.lastSeen;
            case 11:
                return m1.name.localeCompare(m2.name);
            case 12:
                return m2.name.localeCompare(m1.name);
            default:
                return 0;
        }
    })
    //.slice(page * 10, (page + 1) * 10)
    const indexTop = parseInt(page) * 10
    const indexBottom = (parseInt(page) + 1) * 10
    const totalClanMembers = clanMembers.length
    clanMembers = clanMembers.slice(
        indexTop,
        indexBottom
    )
    if (indexBottom >= totalClanMembers) {
        return {
            clanMembersSorted: clanMembers,
            reachedTop: true
        }
    } else {
        return {
            clanMembersSorted: clanMembers,
            reachedTop: false
        }
    }
}

function prepareSortOptions(tag, page) {
    const optionFilterAndSort = []
    optionFilterAndSort.push({
        label: `Rank (desc)`,
        description: `Sort by the rank of the member (desc)`,
        value: buildArgs(
            getSortType(1),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Rank (asc)`,
        description: `Sort by the rank of the member (asc)`,
        value: buildArgs(
            getSortType(2),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Exp Level (desc)`,
        description: `Sort by the king level of member (desc)`,
        value: buildArgs(
            getSortType(3),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Exp Level (asc)`,
        description: `Sort by the king level of member (asc)`,
        value: buildArgs(
            getSortType(4),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations (desc)`,
        description: `Sort by the amount of donations done in the last week (desc)`,
        value: buildArgs(
            getSortType(5),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations (asc)`,
        description: `Sort by the amount of donations done in the last week (asc)`,
        value: buildArgs(
            getSortType(6),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations Received (desc)`,
        description: `Sort by the amount of donations received in the last week (desc)`,
        value: buildArgs(
            getSortType(7),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Weekly Donations Received (asc)`,
        description: `Sort by the amount of donations received in the last week (asc)`,
        value: buildArgs(
            getSortType(8),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Last Seen (desc)`,
        description: `Sort by the last time the member was online (desc)`,
        value: buildArgs(
            getSortType(9),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Last Seen (asc)`,
        description: `Sort by the last time the member was online (asc)`,
        value: buildArgs(
            getSortType(10),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Name (desc)`,
        description: `Sort the members alphabetically (desc)`,
        value: buildArgs(
            getSortType(11),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    optionFilterAndSort.push({
        label: `Name (asc)`,
        description: `Sort the members alphabetically (asc)`,
        value: buildArgs(
            getSortType(12),
            tag,
            page
        ),
        emoji: EmojisValues.Info,
    })
    return optionFilterAndSort
}

async function prepareMembersList(clanMembers, tag, sortType, page = 0) {
    const sortOptions = prepareSortOptions(tag, page)
    const totalClanMembers = clanMembers.length
    sortOptions[sortType - 1].default = true

    const {
        clanMembersSorted,
        reachedTop
    } = prepareClanMembers(clanMembers, sortType, page)

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
                    'view_clan',
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('Clan')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_current_river_race',
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('River Race')
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
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'sort_members_list_previous',
                    getSortType(sortType),
                    tag.replaceAll("%23", "#"),
                    page - 1
                ))
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info)
                .setDisabled(page === 0),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'sort_members_list_next',
                    getSortType(sortType),
                    tag.replaceAll("%23", "#"),
                    page + 1
                ))
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info)
                .setDisabled(reachedTop),
        ))

    const membersFields = []
    let rank = page * 10 + 1
    clanMembersSorted.forEach(member => {
        let role = ""
        switch (member.role.toUpperCase()) {
            case "LEADER":
                role = "Leader"
                break
            case "COLEADER":
                role = "Co-Leader"
                break
            case "ELDER":
            case "ADMIN":
                role = "Elder"
                break
            case "MEMBER":
                role = "Member"
                break
        }

        const differenceRank = member.clanRank - member.previousClanRank
        let rankString = `${member.clanRank}`
        if (differenceRank > 0) {
            rankString += ` - ${differenceRank} :arrow_up:`
        } else if (differenceRank < 0) {
            rankString += ` - ${-differenceRank} :arrow_down:`
        }
        membersFields.push({
            name: `${rank}) ${member.name} (${member.tag})`,
            value:
                `${role} (#${rankString}) - ${member.expLevel} - ${member.trophies}\n` +
                `<t:${member.lastSeen/1000}:${TimestampStyles.ShortDateTime}> (<t:${member.lastSeen/1000}:${TimestampStyles.RelativeTime}>)` +
                `\n${member.donations} - ${member.donationsReceived} - ${member.arena.name}`
        })
        rank++
    })

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotGreen)
        .setTitle(`Clan members ${totalClanMembers}/50`)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .addFields(membersFields)
    return {
        embeds,
        components
    }
}

function parseSortType(sort_type) {
    switch (sort_type) {
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

function getSortType(sort_type) {
    switch (sort_type) {
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

async function fetchMembersList(clanTag) {
    const reqUrl = `https://api.clashroyale.com/v1/clans/${clanTag}/members`
    xhr.open("GET", reqUrl, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("authorization", `Bearer ${env.ROYALE_API}`);
    xhr.send();
    await xhr.responseText;
    const result = JSON.parse(xhr.responseText);

    if (result.reason === "notFound" || result.result === "accessDenied") {
        return {
            clanMembers: null,
            error: true,
            reason: result.reason
        }
    }
    const clanMembers = []
    for (const index in result.items) {
        const member = result.items[index]
        member.lastSeen = new Date(
            member.lastSeen.slice(0, 4),
            parseInt(member.lastSeen.slice(4, 6)) - 1,
            member.lastSeen.slice(6, 8),
            member.lastSeen.slice(9, 11),
            member.lastSeen.slice(11, 13),
            member.lastSeen.slice(13, 15)
        ).getTime()
        clanMembers.push(member)
    }
    return {
        clanMembers,
        error: false
    }
}

module.exports = {
    buttonMembers,
    sortMembers
}