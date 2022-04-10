const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const {ColorsValues} = require("../../../../../res/values/colors");
const {isValidTag} = require("../../../../utils/validate");
const {env} = require("../../../../env");
const {playersHandler} = require("../../../../database/handle/players-handler");
const {buildCustomId} = require("../../../../utils/custom-builder");
const {EmojisValues} = require("../../../../../res/values/emojis");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function autocompleteInfo(client, interaction) {
    interaction.respond([
        {
            name: 'Teogor (#YUR288VGJ)',
            value: '#YUR288VGJ'
        },
        {
            name: 'Simon (#YUP2LQUU8)',
            value: '#YUP2LQUU8'
        }
    ]);
}

async function actionInfo(client, interaction) {
    let tag = interaction.options.getString('tag')
    let user = interaction.options.getUser('user')

    if (user !== null) {
        const guildID = interaction.guild.id
        const playerID = user.id
        const linkedPlayer = await playersHandler.getLinkedPlayer(guildID, playerID)

        if (linkedPlayer === undefined || linkedPlayer === null) {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(`No CR accounts linked to this profile`)
                ],
                ephemeral: true
            })
            return
        }

        tag = linkedPlayer.royale_tag
    } else if (tag === null) {
        const guildID = interaction.guild.id
        const playerID = interaction.user.id
        const linkedPlayer = await playersHandler.getLinkedPlayer(guildID, playerID)

        if (linkedPlayer === undefined || linkedPlayer === null) {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(`No CR accounts linked to this profile`)
                ],
                ephemeral: true
            })
            return
        }

        tag = linkedPlayer.royale_tag
    }

    if (!tag.startsWith('#')) {
        tag = '#' + tag
    }

    if (!isValidTag(tag)) {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setDescription(
                        `An invalid tag was provided!\n` +
                        `These are the valid characters for a tag: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V`
                    )
            ],
            ephemeral: true
        })
        return
    }

    tag = tag.replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const {player, error} = await getPlayer(interaction, tag)

    if (error) {
        return
    }

    await preparePlayerInfo(player, interaction)
}

async function selectMenuMemberInfo(client, interaction) {
    let tag = interaction.values[0]

    if (!isValidTag(tag)) {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setDescription(
                        `An invalid tag was provided!\n` +
                        `These are the valid characters for a tag: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V`
                    )
            ],
            ephemeral: true
        })
        return
    }
    tag = tag.replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const {player, error} = await getPlayer(interaction, tag)

    if (error) {
        return
    }

    await preparePlayerInfo(player, interaction)
}

async function getPlayer(interaction, tag) {
    const reqUrl = 'https://api.clashroyale.com/v1/players/' + tag
    xhr.open("GET", reqUrl, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("authorization", `Bearer ${env.ROYALE_API}`);
    xhr.send();
    await xhr.responseText;
    const result = JSON.parse(xhr.responseText);

    if (result.reason === "notFound") {
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
        return {
            player: null,
            error: true
        }
    } else if (result.reason === "accessDenied") {
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
        return {
            player: null,
            error: true
        }
    }
    return {
        player: result,
        error: false
    }
}

async function preparePlayerInfo(player, interaction) {
    const guildID = interaction.guild.id

    let role = ""
    switch (player.role.toUpperCase()) {
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

    const linkedPlayerID = await playersHandler.isLinked(
        guildID,
        player.tag.replaceAll("#", "")
    )

    const embeds = new MessageEmbed()
        .setColor(ColorsValues.colorBotBlue)
        .setTitle(`${player.name} (${player.tag})`)
        .setFooter({
            text: 'Last Updated at'
        })
        .setTimestamp(Date.now())
        .addFields(
            {
                name: `Level`,
                value: `${player.expLevel} (XP ${player.expPoints})`,
                inline: true
            },
            {
                name: `Trophies`,
                value: `${player.trophies}`,
                inline: true
            },
            {
                name: `Star Points`,
                value: `${player.starPoints}`,
                inline: true
            },
            {
                name: `Clan`,
                value: `${player.clan.name} (${player.clan.tag}) - rank: ${role}`
            }
        )

    const components = []
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_clash_royale_full_profile',
                    player.tag
                ))
                .setLabel('Full Profile')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_river_race_contribution',
                    player.clan.tag,
                    player.tag
                ))
                .setLabel('River Race Contribution')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        ))
    components.push(new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(buildCustomId(
                    'view_clan',
                    player.clan.tag
                ))
                .setLabel('Clan Info')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        ))
    if (linkedPlayerID) {
        embeds.addFields(
            {
                name: `Linked on Discord`,
                value: `Player is linked on Discord <@${linkedPlayerID.player_id}>`
            }
        )
    }
    await interaction.followUp({
        embeds: [embeds],
        components
    })
}

module.exports = {
    autocompleteInfo,
    actionInfo,
    selectMenuMemberInfo
}