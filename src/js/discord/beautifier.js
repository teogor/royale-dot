const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Emoji} = require("discord.js");
const {ColorsValues} = require("../../res/values/colors");
const {EmojisValues, Emojis} = require("../../res/values/emojis");
const {buildCustomId, buildArgs} = require("../utils/custom-builder");
const {royaleRepository} = require("../royale/repository");
const {linkedClansHandler} = require("../database/handle/linked-clans-handler");
const {clansHandler} = require("../database/handle/clans-handler");
const {TimestampStyles} = require("@discordjs/builders");
const {linkedAccountsHandler} = require("../database/handle/linked-accounts-handler");
const {getBadge} = require("../../res/values/badges");

class RoyaleBeautifier {

    async getClan(tag, guildID) {
        const clanInfo = await royaleRepository.getClan(tag, guildID)
        if (clanInfo.error) {
            return clanInfo
        }
        const clan = clanInfo.clan

        let currentIndex = 0
        let optionsTo25 = []
        let optionsTo50 = []
        clan.memberList.forEach(member => {
            const option = {
                label: `#${currentIndex + 1} ${member.name} (${member.tag})`,
                description: `${EmojisValues.Rank}${member.role.nameUp} ⚬ ${member.trophies}${Emojis.Trophy} ⚬ ${member.expLevel}${EmojisValues.Star} `,
                value: `${member.tag}`,
                emoji: Emojis.UserDetails,
            }
            if (currentIndex < 25) {
                optionsTo25.push(option)
            } else {
                optionsTo50.push(option)
            }
            currentIndex++
        })
        const components = []
        const rowMembersTo25 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_member_to_25')
                    .setPlaceholder('Clan members (ranked from 1 to 25)')
                    .addOptions(optionsTo25),
            );
        components.push(rowMembersTo25)
        if (currentIndex >= 25) {
            const rowMembersTo50 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select_member_to_50')
                        .setPlaceholder('Clan members (ranked from 26 to 50)')
                        .addOptions(optionsTo50),
                );
            components.push(rowMembersTo50)
        }
        const rowButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_members_list',
                        clan.details.tag
                    ))
                    .setLabel('Members list')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_current_river_race',
                        clan.details.tag
                    ))
                    .setLabel('River Race')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanWars),
                new MessageButton()
                    .setCustomId('view_past_wars')
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            );
        components.push(rowButtons)

        const embeds = new MessageEmbed()
            .setColor(ColorsValues.colorBotGreen)
            .setTitle(`${getBadge(clan.details.badgeId)} ${clan.details.name} (${clan.details.tag})`)
            .setDescription(clan.details.description)
            .setFooter({
                text: 'Last Updated at'
            })
            .setTimestamp(Date.now())
            .setThumbnail(`https://www.deckshop.pro/img/badges/${clan.details.badgeId}.png`)
            .addFields(
                {
                    name: `War Trophies`,
                    value: `${Emojis.TrophyClanWars} ${clan.details.clanWarTrophies}`,
                    inline: true
                },
                {
                    name: `Location`,
                    value: `${Emojis.Location} ${clan.details.locationName}`,
                    inline: true
                },
                {
                    name: `Score`,
                    value: `${Emojis.ClanPoints} ${clan.details.clanScore}`,
                    inline: true
                },
                {
                    name: `Weekly Donations`,
                    value: `${Emojis.CardsDonated} ${clan.details.donationsPerWeek}`,
                    inline: true
                },
                {
                    name: `Members`,
                    value: `${Emojis.Members} ${clan.details.members}/50`,
                    inline: true
                },
                {
                    name: `Required Trophies`,
                    value: `${Emojis.Trophies} ${clan.details.requiredTrophies}`,
                    inline: true
                },
                {
                    name: `Join Type`,
                    value: `${clan.details.type}`,
                    inline: true
                }
            )
        return {
            embeds: [embeds],
            components
        }
    }

    async getClanRiverRace(tag, guildID) {
        const clanRiverRaceInfo = await royaleRepository.getClanRiverRace(tag, guildID)
        tag = clanRiverRaceInfo.tag
        if (clanRiverRaceInfo.error) {
            return clanRiverRaceInfo
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        const {
            participants,
            clans,
            periodType,
            isTraining,
            battleDay
        } = clanRiverRace.details

        let title = ''
        if (periodType === 'warDay') {
            title += `River Race | `
        } else if (periodType === 'colloseum') {
            title += `Colloseum | `
        }
        if (isTraining) {
            title += `${Emojis.TrainingDays} Training Day #${battleDay}`
        } else {
            title += `Day #${battleDay}`
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
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_clan',
                        tag
                    ))
                    .setLabel('Clan')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Clan),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_members_list',
                        tag
                    ))
                    .setLabel('Participants')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_past_wars',
                        tag
                    ))
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            ))
        return {
            embeds: [embeds],
            components
        }
    }

    async getRiverRaceContribution(clanTag, userTag, guildID) {
        const clanRiverRaceInfo = await royaleRepository.getClanRiverRace(clanTag, guildID)
        if (clanRiverRaceInfo.error) {
            return clanRiverRaceInfo
        }
        const clanRiverRace = clanRiverRaceInfo.clanRiverRace

        const {
            participants,
            clans,
            periodType,
            isTraining,
            battleDay
        } = clanRiverRace.details

        const players = participants.filter((player) => {
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
        let title = `${player.name} (${player.tag}) | `
        if (periodType === 'warDay') {
            title += `Current Contribution`
        } else if (periodType === 'colloseum') {
            title += `Current Contribution`
        }

        const embeds = new MessageEmbed()
            .setColor(ColorsValues.colorBotBlue)
            .setTitle(title)
            .setFooter({
                text: 'Last Updated at'
            })
            .addFields([
                {
                    name: `Fame`,
                    value: `${player.fame}`
                }
            ])
            .setTimestamp(Date.now())

        const components = []
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_river_race_participants',
                        clanTag
                    ))
                    .setLabel('Participants')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanMembers),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_clan',
                        clanTag
                    ))
                    .setLabel('Clan')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Clan),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_past_wars',
                        clanTag
                    ))
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            ))
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_profile_overview',
                        player.tag
                    ))
                    .setLabel('User Overview')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.UserDetails),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_player',
                        player.tag
                    ))
                    .setLabel('Profile')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.UserDetails),
            ))

        return {
            embeds: [embeds],
            components
        }
    }

    async linkClan(tag, guildID) {
        const guildLinked = await linkedClansHandler.isLinked(guildID)
        if (guildLinked.isGuildLinked) {
            const clanDetails = await clansHandler.getDetails(guildLinked.tag)
            return {
                error: true,
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotBlue)
                        .setDescription(`${Emojis.Check} Server already linked to **${clanDetails.name}** (\`${guildLinked.tag}\`)!`)
                ],
                ephemeral: true
            }
        }

        const tagData = await royaleRepository.getTag(tag)
        if (tagData.error) {
            return tagData
        }

        const clanInfo = await royaleRepository.getClan(tag, guildID)
        if (clanInfo.error) {
            return clanInfo
        }
        const clan = clanInfo.clan.details
        linkedClansHandler.linkClan(guildID, clan.tag)

        return {
            error: true,
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotGreen)
                    .setDescription(`${Emojis.Check} Server linked to **${clan.name}** (${clan.tag})!`)
            ],
            ephemeral: true
        }
    }

    async getClanMembers(tag, guildID, sortType = "sort_rank_desc", page = 0) {
        const clanMembersInfo = await royaleRepository.getClanMembers(tag, guildID)
        if (clanMembersInfo.error) {
            return clanMembersInfo
        }
        const clanMembers = clanMembersInfo.members

        sortType = this.parseSortType(sortType)
        return this.prepareMembersList(clanMembers, clanMembersInfo.tag, sortType, page)
    }

    async prepareMembersList(clanMembers, tag, sortType, page) {
        const sortOptions = this.prepareSortOptions(tag, page)
        const totalClanMembers = clanMembers.members.length
        sortOptions[sortType - 1].default = true

        const {
            clanMembersSorted,
            reachedTop
        } = this.prepareClanMembers(clanMembers, sortType, page)

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
                        tag
                    ))
                    .setLabel('Clan')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Clan),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_current_river_race',
                        tag
                    ))
                    .setLabel('River Race')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.ClanWars),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_past_wars',
                        tag
                    ))
                    .setLabel('Past Wars')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Logs),
            ))
        components.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'sort_members_list_previous',
                        this.getSortType(sortType),
                        tag,
                        page - 1
                    ))
                    .setLabel('Previous')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Previous)
                    .setDisabled(page === 0),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'sort_members_list_next',
                        this.getSortType(sortType),
                        tag,
                        page + 1
                    ))
                    .setLabel('Next')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.Next)
                    .setDisabled(reachedTop),
            ))

        const membersFields = []
        let rank = page * 10 + 1
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
                    `${member.role.nameUp} (#${rankString}) - ${Emojis.KingLevel} ${member.expLevel} - ${Emojis.Trophies} ${member.trophies}\n` +
                    `${Emojis.LastSeen} <t:${member.lastSeen / 1000}:${TimestampStyles.ShortDateTime}> (<t:${member.lastSeen / 1000}:${TimestampStyles.RelativeTime}>)` +
                    `\n${Emojis.CardsDonated} ${member.donations} - ${Emojis.CardsReceived} ${member.donationsReceived} - ${member.arena.name}`
            })
            rank++
        })

        let embeds = new MessageEmbed()
            .setColor(ColorsValues.colorBotGreen)
            .setTitle(`${Emojis.Members} Clan members ${totalClanMembers}/50`)
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

    prepareSortOptions(tag, page) {
        const optionFilterAndSort = []
        optionFilterAndSort.push({
            label: `Rank (desc)`,
            description: `Sort by the rank of the member (desc)`,
            value: buildArgs(
                this.getSortType(1),
                tag,
                page
            ),
            emoji: Emojis.Trophies,
        })
        optionFilterAndSort.push({
            label: `Rank (asc)`,
            description: `Sort by the rank of the member (asc)`,
            value: buildArgs(
                this.getSortType(2),
                tag,
                page
            ),
            emoji: Emojis.Trophies,
        })
        optionFilterAndSort.push({
            label: `Exp Level (desc)`,
            description: `Sort by the king level of member (desc)`,
            value: buildArgs(
                this.getSortType(3),
                tag,
                page
            ),
            emoji: Emojis.KingLevel,
        })
        optionFilterAndSort.push({
            label: `Exp Level (asc)`,
            description: `Sort by the king level of member (asc)`,
            value: buildArgs(
                this.getSortType(4),
                tag,
                page
            ),
            emoji: Emojis.KingLevel,
        })
        optionFilterAndSort.push({
            label: `Weekly Donations (desc)`,
            description: `Sort by the amount of donations done in the last week (desc)`,
            value: buildArgs(
                this.getSortType(5),
                tag,
                page
            ),
            emoji: Emojis.CardsDonated,
        })
        optionFilterAndSort.push({
            label: `Weekly Donations (asc)`,
            description: `Sort by the amount of donations done in the last week (asc)`,
            value: buildArgs(
                this.getSortType(6),
                tag,
                page
            ),
            emoji: Emojis.CardsDonated,
        })
        optionFilterAndSort.push({
            label: `Weekly Donations Received (desc)`,
            description: `Sort by the amount of donations received in the last week (desc)`,
            value: buildArgs(
                this.getSortType(7),
                tag,
                page
            ),
            emoji: Emojis.CardsReceived,
        })
        optionFilterAndSort.push({
            label: `Weekly Donations Received (asc)`,
            description: `Sort by the amount of donations received in the last week (asc)`,
            value: buildArgs(
                this.getSortType(8),
                tag,
                page
            ),
            emoji: Emojis.CardsReceived,
        })
        optionFilterAndSort.push({
            label: `Last Seen (desc)`,
            description: `Sort by the last time the member was online (desc)`,
            value: buildArgs(
                this.getSortType(9),
                tag,
                page
            ),
            emoji: Emojis.LastSeen,
        })
        optionFilterAndSort.push({
            label: `Last Seen (asc)`,
            description: `Sort by the last time the member was online (asc)`,
            value: buildArgs(
                this.getSortType(10),
                tag,
                page
            ),
            emoji: Emojis.LastSeen,
        })
        optionFilterAndSort.push({
            label: `Name (desc)`,
            description: `Sort the members alphabetically (desc)`,
            value: buildArgs(
                this.getSortType(11),
                tag,
                page
            ),
            emoji: Emojis.ClanRankUp,
        })
        optionFilterAndSort.push({
            label: `Name (asc)`,
            description: `Sort the members alphabetically (asc)`,
            value: buildArgs(
                this.getSortType(12),
                tag,
                page
            ),
            emoji: Emojis.ClanRankDown,
        })
        return optionFilterAndSort
    }

    prepareClanMembers(clanMembers, sortType, page) {
        clanMembers.sortBy(sortType)

        const indexTop = parseInt(page) * 10
        const indexBottom = (parseInt(page) + 1) * 10
        const totalClanMembers = clanMembers.length
        const members = clanMembers.members.slice(
            indexTop,
            indexBottom
        )
        if (indexBottom >= totalClanMembers) {
            return {
                clanMembersSorted: members,
                reachedTop: true
            }
        } else {
            return {
                clanMembersSorted: members,
                reachedTop: false
            }
        }
    }

    parseSortType(sort_type) {
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

    getSortType(sort_type) {
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

    async linkAccount(tag, guildID, userID) {
        const tagData = await royaleRepository.parseTag(tag)
        if (tagData.error) {
            return tagData
        }

        const playerLinked = await linkedAccountsHandler.isLinked(userID, tag)
        if (playerLinked.isLinked) {
            return {
                error: true,
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotBlue)
                        .setDescription(`${Emojis.Check} <@${userID}> already linked to **${playerLinked.linkedName}**(\`${playerLinked.linkedTag}\`)!`)
                ],
                ephemeral: true
            }
        } else if (playerLinked.isTagLinked) {
            return {
                error: true,
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(`${Emojis.Close} failed: tag already linked to another player!`)
                ],
                ephemeral: true
            }
        }

        const playerInfo = await royaleRepository.getPlayer(tag)
        if (playerInfo.error) {
            return playerInfo
        }

        const player = playerInfo.player

        await linkedAccountsHandler.linkPlayer(userID, player.tag)

        return {
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotGreen)
                    .setDescription(`${Emojis.Check} Account linked to **${player.name}**!`)
            ],
            ephemeral: false,
            player
        }
    }

    async getPlayerInfo(tag) {
        const playerInfo = await royaleRepository.getPlayer(tag)
        if (playerInfo.error) {
            return playerInfo
        }
        const player = playerInfo.player

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
                        'view_player',
                        player.tag
                    ))
                    .setLabel('Profile')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.UserDetails),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_river_race_contribution',
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
                        'view_clan',
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

    async getPlayerProfile(tag) {
        const playerInfo = await royaleRepository.getPlayer(tag)
        if (playerInfo.error) {
            return playerInfo
        }
        const player = playerInfo.player

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
            } else {
                return
            }
        })
        badgesDescription = badgesDescription.slice(0, -2)

        const fields = []
        fields.push(
            {
                name: `Level`,
                value: `${Emojis.KingLevel} **${player.expLevel}** (${Emojis.XP} **${player.expPoints}** XP)`,
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
                        'view_profile_overview',
                        player.tag
                    ))
                    .setLabel('User Overview')
                    .setStyle('PRIMARY')
                    .setEmoji(Emojis.UserDetails),
                new MessageButton()
                    .setCustomId(buildCustomId(
                        'view_river_race_contribution',
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
                        'view_clan',
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

}

module.exports = {
    royaleBeautifier: new RoyaleBeautifier()
}