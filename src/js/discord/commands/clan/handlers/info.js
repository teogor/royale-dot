const {clansHandler} = require("../../../../database/handle/clans-handler");
const {isValidTag} = require("../../../../utils/validate");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {env} = require("../../../../env");
const {EmojisValues} = require("../../../../../res/values/emojis");
const {buildCustomId} = require("../../../../utils/custom-builder");
const {linkedClansHandler} = require("../../../../database/handle/linked-clans-handler");
const {getClanInfo} = require("../../../../api/royale/handle");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function autocompleteInfo(client, interaction) {
    const tag = interaction.options.getString('tag')
    const guildID = interaction.guild.id

    let recommendedClans = []
    const guildLinked = await linkedClansHandler.isLinked(guildID)
    if (guildLinked.isGuildLinked) {
        const clanDetails = await clansHandler.getDetails(guildLinked.tag)
        const autocompleteClan = {
            name: `${clanDetails.name} (${guildLinked.tag})`,
            value: `${guildLinked.tag}`
        }
        recommendedClans.push(autocompleteClan)
    }

    const recommendedClansDB = await clansHandler.getRecommendedClans(tag)
    recommendedClansDB.forEach(recommendedClan => {
        if (recommendedClan.tag !== guildLinked.tag) {
            const autocompleteClan = {
                name: `${recommendedClan.name} (${recommendedClan.tag})`,
                value: `${recommendedClan.tag}`
            }
            recommendedClans.push(autocompleteClan)
        }
    })
    interaction.respond(recommendedClans);
}

async function buttonClanInfo(client, interaction) {
    const tag = interaction.arguments[0].replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const {
        clanInfo,
        error,
        reason
    } = await fetchClanInfo(tag)

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
    } = await prepareClanInfo(clanInfo, tag)

    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

async function actionInfo(client, interaction) {
    const guildID = interaction.guild.id
    const guildLinked = await linkedClansHandler.isLinked(guildID)

    let tag = interaction.options.getString('tag')
    if (tag === null && guildLinked.isGuildLinked) {
        tag = guildLinked.tag
    }

    const requestClanInfo = {
        interaction,
        tag
    }

    const {
        clan
    } = await getClanInfo(requestClanInfo)
    if (clan === undefined) {
        return
    }

    const {
        components,
        embeds
    } = await prepareClanInfo(clan)

    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

async function prepareClanInfo(clan) {
    const tag = clan.tag
    let currentIndex = 0
    let optionsTo25 = []
    let optionsTo50 = []
    clan.memberList.forEach(member => {
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
        const option = {
            label: `#${currentIndex + 1} ${member.name} (${member.tag})`,
            description: `${EmojisValues.Rank}${role} ⚬ ${member.trophies}${EmojisValues.Trophy} ⚬ ${member.expLevel}${EmojisValues.Star} `,
            value: `${member.tag}`,
            emoji: EmojisValues.Info,
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
                    tag.replaceAll("%23", "#")
                ))
                .setLabel('Members list')
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
                .setCustomId('view_past_wars')
                .setLabel('Past Wars')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        );
    components.push(rowButtons)

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotGreen)
        .setTitle(`${clan.name} (${clan.tag})`)
        .setDescription(clan.description)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .setThumbnail(`https://www.deckshop.pro/img/badges/${clan.badgeId}.png`)
        .addFields(
            {
                name: `War Trophies`,
                value: `${clan.clanWarTrophies}`,
                inline: true
            },
            {
                name: `Location`,
                value: `${clan.location.name}`,
                inline: true
            },
            {
                name: `Score`,
                value: `${clan.clanScore}`,
                inline: true
            },
            {
                name: `Weekly Donations`,
                value: `${clan.donationsPerWeek}`,
                inline: true
            },
            {
                name: `Members`,
                value: `${clan.members}/50`,
                inline: true
            },
            {
                name: `Required Trophies`,
                value: `${clan.requiredTrophies}`,
                inline: true
            },
            {
                name: `Join Type`,
                value: `${clan.type}`,
                inline: true
            }
        )
    return {
        embeds,
        components
    }
}

async function fetchClanInfo(clanTag) {
    const reqUrl = `https://api.clashroyale.com/v1/clans/${clanTag}`
    xhr.open("GET", reqUrl, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("authorization", `Bearer ${env.ROYALE_API}`);
    xhr.send();
    await xhr.responseText;
    const result = JSON.parse(xhr.responseText);

    if (result.reason === "notFound" || result.result === "accessDenied") {
        return {
            clanInfo: null,
            error: true,
            reason: result.reason
        }
    }
    return {
        clanInfo: result,
        error: false
    }
}

module.exports = {
    autocompleteInfo,
    actionInfo,
    buttonClanInfo
}