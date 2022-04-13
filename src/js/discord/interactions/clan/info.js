const {royaleRepository} = require("../../../royale/repository");
const {sendFollowUp, sendButtonResponse} = require("../response");
const {EmojisValues, Emojis} = require("../../../../res/values/emojis");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed} = require("discord.js");
const {buildCustomId, buildArgs} = require("../../../utils/custom-builder");
const {ColorsValues} = require("../../../../res/values/colors");
const {getBadge} = require("../../../../res/values/badges");

async function showClanInfo(clanData) {
    const {
        details,
        members
    } = clanData

    let currentIndex = 0
    let clanMembers = []
    members.forEach(member => {
        const option = {
            label: `#${currentIndex + 1} ${member.name} (${member.tag})`,
            description: `${EmojisValues.Rank}${member.role.nameUp} ⚬ ${member.trophies}${Emojis.Trophy} ⚬ ${member.expLevel}${EmojisValues.Star} `,
            value: buildArgs(
                member.tag
            ),
            emoji: Emojis.UserDetails,
        }
        clanMembers.push(option)
        currentIndex++
    })
    const components = []
    let limit25 = 25
    if (clanMembers.length < 25) {
        limit25 = clanMembers.length
    }
    components.push(new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select_member_to_25')
                .setPlaceholder(`Clan Members - From 1 To ${limit25} Sorted by Medals`)
                .addOptions(clanMembers.slice(0, 25),
        ))
    )
    if (clanMembers.length > 25) {
        let limit50 = 50
        if (clanMembers.length < 50) {
            limit50 = clanMembers.length
        }
        components.push(new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select_member_to_50')
                    .setPlaceholder(`Clan Members - From 26 To ${limit50} Sorted by Medals`)
                    .addOptions(clanMembers.slice(25, 50)),
            ))
    }
    const rowButtons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_clan_members',
                    details.tag
                ))
                .setLabel('Members list')
                .setStyle('PRIMARY')
                .setEmoji(Emojis.ClanMembers),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'button_current_river_race',
                    details.tag
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
        .setTitle(`${getBadge(details.badgeId)} ${details.name} (${details.tag})`)
        .setDescription(details.description)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .setThumbnail(`https://www.deckshop.pro/img/badges/${details.badgeId}.png`)
        .addFields(
            {
                name: `War Trophies`,
                value: `${Emojis.TrophyClanWars} ${details.clanWarTrophies}`,
                inline: true
            },
            {
                name: `Location`,
                value: `${Emojis.Location} ${details.locationName}`,
                inline: true
            },
            {
                name: `Score`,
                value: `${Emojis.ClanPoints} ${details.clanScore}`,
                inline: true
            },
            {
                name: `Weekly Donations`,
                value: `${Emojis.CardsDonated} ${details.donationsPerWeek}`,
                inline: true
            },
            {
                name: `Members`,
                value: `${Emojis.Members} ${details.members}/50`,
                inline: true
            },
            {
                name: `Required Trophies`,
                value: `${Emojis.Trophies} ${details.requiredTrophies}`,
                inline: true
            },
            {
                name: `Join Type`,
                value: `${details.type}`,
                inline: true
            }
        )
    return {
        embeds: [embeds],
        components
    }
}

function commandClanInfo(interaction, client) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    royaleRepository.getClan(tag, guildID).then(clanInfo => {
        if (clanInfo.error) {
            sendFollowUp(interaction, clanInfo)
            return
        }

        const clan = clanInfo.clan

        showClanInfo(clan).then(followUpMessage => {
            sendFollowUp(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

function buttonClanInfo(interaction, client) {
    const tag = interaction.arguments[0]
    const guildID = interaction.guild.id

    royaleRepository.getClan(tag, guildID).then(clanInfo => {
        if (clanInfo.error) {
            sendFollowUp(interaction, clanInfo)
            return
        }

        const clan = clanInfo.clan

        showClanInfo(clan).then(followUpMessage => {
            sendButtonResponse(interaction, followUpMessage)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    commandClanInfo,
    buttonClanInfo
}