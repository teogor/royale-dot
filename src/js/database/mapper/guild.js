const guildRepository = require("../repository/guild-repository");
const {Guild} = require("../model/guild");
const {ColorsValues} = require("../../../res/values/colors");

function onCheckGuild(guildDiscord) {
    guildRepository.insertGuild(
        Guild.fromDiscordModel(guildDiscord)
    ).then(_ => {
        guildRepository.getGuild(
            guildDiscord.id
        ).then(guild => {
            const rolesAndChannels = {
                leaderRole: undefined,
                coleaderRole: undefined,
                elderRole: undefined,
                memberRole: undefined,
                commandsChannel: undefined
            }
            prepareRoles(guild, guildDiscord, rolesAndChannels)
        })
    })
}

function prepareChannels(guild, guildDiscord, rolesAndChannels) {
    const {
        channelCommandsId
    } = guild
    const {
        leaderRole,
        coleaderRole
    } = rolesAndChannels
    if (channelCommandsId == null) {
        guildDiscord.channels.create("royale-dot-command", {
            type: "text",
            permissionOverwrites: [
                {
                    id: guildDiscord.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: leaderRole,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                {
                    id: coleaderRole,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                }
            ],
        }).then(channel => {
            guild.channelCommandsId = channel.id
            guildRepository.updateChannels(guild)
        })
    }
}

function prepareRoles(guild, guildDiscord, rolesAndChannels) {
    const {
        roleLeaderId,
        roleColeaderId,
        roleElderId,
        roleMemberId
    } = guild

    if (roleLeaderId === null) {
        guildDiscord.roles.create({
            name: "leader",
            color: ColorsValues.colorRankLeader,
            hoist: true
        }).then(role => {
            guild.roleLeaderId = role.id
            rolesAndChannels.leaderRole = role
            prepareRoles(guild, guildDiscord, rolesAndChannels)
        })
    } else if (roleColeaderId == null) {
        guildDiscord.roles.create({
            name: "co-leader",
            color: ColorsValues.colorRankColeader,
            hoist: true
        }).then(role => {
            guild.roleColeaderId = role.id
            rolesAndChannels.coleaderRole = role
            prepareRoles(guild, guildDiscord, rolesAndChannels)
        })
    } else if (roleElderId == null) {
        guildDiscord.roles.create({
            name: "elder",
            color: ColorsValues.colorRankElder,
            hoist: true
        }).then(role => {
            guild.roleElderId = role.id
            rolesAndChannels.elderRole = role
            prepareRoles(guild, guildDiscord, rolesAndChannels)
        })
    } else if (roleMemberId == null) {
        guildDiscord.roles.create({
            name: "member",
            color: ColorsValues.colorRankMember,
            hoist: true
        }).then(role => {
            guild.roleMemberId = role.id
            rolesAndChannels.memberRole = role
            prepareRoles(guild, guildDiscord, rolesAndChannels)
        }).catch(e => {
            console.log(e)
        })
    } else if (rolesAndChannels.leaderRole === undefined) {
        rolesAndChannels.leaderRole = guildDiscord.roles.cache.get(roleLeaderId)
        prepareRoles(guild, guildDiscord, rolesAndChannels)
    } else if (rolesAndChannels.coleaderRole === undefined) {
        rolesAndChannels.coleaderRole = guildDiscord.roles.cache.get(roleColeaderId)
        prepareRoles(guild, guildDiscord, rolesAndChannels)
    } else if (rolesAndChannels.elderRole === undefined) {
        rolesAndChannels.elderRole = guildDiscord.roles.cache.get(roleElderId)
        prepareRoles(guild, guildDiscord, rolesAndChannels)
    } else if (rolesAndChannels.memberRole === undefined) {
        rolesAndChannels.memberRole = guildDiscord.roles.cache.get(roleMemberId)
        prepareRoles(guild, guildDiscord, rolesAndChannels)
    } else {
        guildRepository.updateRoles(guild)
        prepareChannels(guild, guildDiscord, rolesAndChannels)
    }
}

module.exports = {
    onCheckGuild,
    prepareChannels,
    prepareRoles
}