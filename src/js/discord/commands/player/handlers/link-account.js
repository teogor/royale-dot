const {playersHandler} = require("../../../../database/handle/players-handler");
const {MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu} = require("discord.js");
const {env} = require("../../../../env");
const {guildsHandler} = require("../../../../database/handle/guilds-handler");
const {ColorsValues} = require("../../../../../res/values/colors");
const {EmojisValues} = require("../../../../../res/values/emojis");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function autocompleteLinkAccount(client, interaction) {
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

async function actionLinkAccount(client, interaction) {
    let tag = interaction.options.getString('tag')
    if (!tag.startsWith('#')) {
        tag = '#' + tag
    }
    tag = tag.replaceAll("#", "%23").replaceAll("\\s+", "").toUpperCase()

    const {guildId, user} = interaction
    const {id: userId} = user

    const alreadyVerified = await playersHandler.isVerified(
        guildId,
        userId,
        tag.replaceAll("%23", "")
    )

    const row1 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Clan members (from 1 to 25)')
                .addOptions([
                    {
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                ]),
        );
    const row2 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('selec2t')
                .setPlaceholder('Clan members (from 26 to 50)')
                .addOptions([
                    {
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                        emoji: EmojisValues.Info,
                    },
                    {
                        label: '#8 Teogor (#31425367)',
                        description: `${EmojisValues.Rank}Co-Leader ⚬ 5234${EmojisValues.Trophy} ⚬ 13${EmojisValues.Star} `,
                        value: 'second_option',
                        emoji: EmojisValues.Info,
                    },
                ]),
        );
    const row3 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('Primary')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId('prima1ry')
                .setLabel('Primary')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
            new MessageButton()
                .setCustomId('prima2ry')
                .setLabel('Primary')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        );

    const row4 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary3')
                .setLabel('Primary')
                .setStyle('PRIMARY')
                .setEmoji(EmojisValues.Info),
        );

    if (alreadyVerified) {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(`:id: Account already linked to **${alreadyVerified.name}**!`)
            ],
            components: [row1, row2, row3, row4]
        })
        return
    }

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
                    .setTitle("Invalid Player Tag")
                    .setDescription(
                        "No player was found with the following tag: **" +
                        tag.replaceAll("%23", "") + "**"
                    )
            ]
        })
    } else if (result.reason === "accessDenied") {
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotRed)
                    .setTitle("Error")
                    .setDescription(
                        "Something went wrong. Please try again later :("
                    )
            ]
        })
    } else {
        // todo #YUR288VGJ
        let role;
        let rank;
        switch (result.role.toUpperCase()) {
            case "LEADER":
                role = 4;
                rank = "leader"
                break
            case "COLEADER":
                role = 3;
                rank = "co-leader"
                break
            case "ELDER":
            case "ADMIN":
                role = 2;
                rank = "elder"
                break
            case "MEMBER":
                role = 1;
                rank = "member"
                break
            default:
                role = 0;
                break
        }

        let roleId
        switch (role) {
            case 1:
                roleId = await guildsHandler.getMemberRoleID(guildId)
                if (interaction.member.id !== interaction.member.guild.ownerId) {
                    await interaction.guild.roles.fetch()
                    interaction.guild.roles.cache.forEach(role => {
                        if (roleId.id === role.id) {
                            interaction.member.roles.add(role)
                        }
                    });
                }
                break
            case 2:
                roleId = await guildsHandler.getElderRoleID(guildId)
                if (interaction.member.id !== interaction.member.guild.ownerId) {
                    await interaction.guild.roles.fetch()
                    interaction.guild.roles.cache.forEach(role => {
                        if (roleId.id === role.id) {
                            interaction.member.roles.add(role)
                        }
                    });
                }
                break
            case 3:
                roleId = await guildsHandler.getColeaderRoleID(guildId)
                if (interaction.member.id !== interaction.member.guild.ownerId) {
                    await interaction.guild.roles.fetch()
                    interaction.guild.roles.cache.forEach(role => {
                        if (roleId.id === role.id) {
                            interaction.member.roles.add(role)
                        }
                    });
                }
                break
            case 4:
                roleId = await guildsHandler.getLeaderRoleID(guildId)
                if (interaction.member.id !== interaction.member.guild.ownerId) {
                    await interaction.guild.roles.fetch()
                    interaction.guild.roles.cache.forEach(role => {
                        if (roleId.id === role.id) {
                            interaction.member.roles.add(role)
                        }
                    });
                }
                break
        }
        let userNickname = interaction.user.username
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            try {
                await interaction.member.setNickname(result.name)
            } catch (e) {

            }
        }
        playersHandler.addNewPlayer(
            guildId,
            userId,
            result,
            tag.replaceAll("%23", ""),
            role
        )
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotGreen)
                    .setDescription(`✅ Account linked to **${result.name}**!`)
            ],
        })
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(
                        ` :mag_right: username changed from ~~**${userNickname}**~~ to **${result.name}**\n` +
                        ` :bookmark_tabs: rank assigned: <@&${roleId.id}>`
                    )
            ],
        })
    }
}

module.exports = {
    autocompleteLinkAccount,
    actionLinkAccount
}