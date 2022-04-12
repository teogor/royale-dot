const {MessageEmbed} = require("discord.js");
const {guildsHandler} = require("../../../../database/handle/guilds-handler");
const {ColorsValues} = require("../../../../../res/values/colors");
const {royaleBeautifier} = require("../../../beautifier");
const {clansHandler} = require("../../../../database/handle/clans-handler");
const {linkedAccountsHandler} = require("../../../../database/handle/linked-accounts-handler");
const {linkedClansHandler} = require("../../../../database/handle/linked-clans-handler");
const {playersHandler} = require("../../../../database/handle/players-handler");

async function autocompleteUnlink(client, interaction) {
    const userID = interaction.user.id

    const playerLinked = await linkedAccountsHandler.isLinked(userID, "")
    let recommendedClans = []
    if (playerLinked.isLinked) {
        const autocompleteClan = {
            name: `${playerLinked.linkedName} (${playerLinked.linkedTag})`,
            value: `${playerLinked.linkedTag}`
        }
        recommendedClans.push(autocompleteClan)
    }
    interaction.respond(recommendedClans);
}

async function actionUnlink(client, interaction) {
    const userID = interaction.user.id
    const guildID = interaction.guild.id
    const playerLinked = await linkedAccountsHandler.isLinked(userID, "")

    if (playerLinked.isLinked) {
        await linkedAccountsHandler.unlinkPlayer(
            userID,
            playerLinked.linkedTag
        )

        const roles = await guildsHandler.getRoles(guildID)
        let rolesIDs = []
        for (const rolesKey in roles) {
            rolesIDs.push(roles[rolesKey])
        }
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            interaction.guild.roles.cache.filter(role => {
                return rolesIDs.includes(role.id)
            }).forEach(role => {
                interaction.member.roles.remove(role)
            });
            if (interaction.member.id !== interaction.member.guild.ownerId) {
                try {
                    await interaction.member.setNickname(`former-${interaction.member.nickname}`)
                } catch (e) {

                }
            }
        }

        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotGreen)
                    .setDescription(
                        `The player was unlinked successfully`
                    )
            ],
        })
    } else {

        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotGreen)
                    .setDescription(
                        `No players linked`
                    )
            ],
        })
    }
}

async function autocompleteLinkAccount(client, interaction) {
    const guildID = interaction.guild.id
    const tag = interaction.options.getString('tag')

    const guildLinked = await linkedClansHandler.isLinked(guildID)
    let recommendedClans = []
    if (guildLinked.isGuildLinked) {
        const members = await playersHandler.getForClan(guildLinked.tag, tag)
        members.forEach(member => {
            const autocompleteClan = {
                name: `${member.name} (${member.tag})`,
                value: `${member.tag}`
            }
            recommendedClans.push(autocompleteClan)
        })
    }
    interaction.respond(recommendedClans.slice(0, 25));
}

async function actionLinkAccount(client, interaction) {
    const guildID = interaction.guildId
    const userID = interaction.user.id
    const tag = interaction.options.getString('tag')

    const linkAccountData = await royaleBeautifier.linkAccount(tag, guildID, userID)

    await interaction.followUp({
        ...linkAccountData
    })

    if (!linkAccountData.error) {
        const player = linkAccountData.player
        const roleID = await guildsHandler.getRoleID(guildID, player.role.type)
        let userNickname = interaction.user.username
        if (interaction.member.id !== interaction.member.guild.ownerId) {
            await interaction.guild.roles.fetch()
            interaction.guild.roles.cache.forEach(role => {
                if (roleID.id === role.id) {
                    interaction.member.roles.add(role)
                }
            });
            if (interaction.member.id !== interaction.member.guild.ownerId) {
                try {
                    await interaction.member.setNickname(player.name)
                } catch (e) {

                }
            }
        }
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(ColorsValues.colorBotBlue)
                    .setDescription(
                        ` :mag_right: username changed from ~~**${userNickname}**~~ to **${player.name}**\n` +
                        ` :bookmark_tabs: rank assigned: <@&${roleID.id}>`
                    )
            ],
        })
    }
}

module.exports = {
    autocompleteLinkAccount,
    actionLinkAccount,
    autocompleteUnlink,
    actionUnlink
}