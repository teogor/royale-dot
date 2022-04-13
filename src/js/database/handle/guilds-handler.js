const {AppDAO} = require("../dao");
const {GuildsRepository} = require("../repository/guilds-repository");
const {ColorsValues} = require("../../../res/values/colors");

class GuildsHandler {

    //#region VARIABLES
    get guildsRepository() {
        return this._guildsRepository;
    }

    set guildsRepository(value) {
        this._guildsRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.guildsRepository = new GuildsRepository(AppDAO)
    }

    prepareChannels(guild, rolesAndChannelsIDs, rolesAndChannels) {
        const guildID = guild.id
        const {
            commandsChannelID
        } = rolesAndChannelsIDs
        const {
            leaderRole,
            coleaderRole
        } = rolesAndChannels
        if (commandsChannelID == null) {
            guild.channels.create("royale-dot-command", {
                type: "text",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
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
                this.updateCommandsChannel(
                    guildID,
                    channel.id
                )
            })
        }
    }

    prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels) {
        const guildID = guild.id
        const {leaderID, coleaderID, elderID, memberID} = rolesAndChannelsIDs

        if (leaderID === null) {
            guild.roles.create({
                name: "leader",
                color: ColorsValues.colorRankLeader,
                hoist: true
            }).then(role => {
                this.updateLeaderRole(
                    guildID,
                    role.id
                )
                rolesAndChannelsIDs.leaderID = role.id
                rolesAndChannels.leaderRole = role
                this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
            })
        } else if (coleaderID == null) {
            guild.roles.create({
                name: "co-leader",
                color: ColorsValues.colorRankColeader,
                hoist: true
            }).then(role => {
                this.updateColeaderRole(
                    guildID,
                    role.id
                )
                rolesAndChannelsIDs.coleaderID = role
                rolesAndChannels.coleaderRole = role
                this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
            })
        } else if (elderID == null) {
            guild.roles.create({
                name: "elder",
                color: ColorsValues.colorRankElder,
                hoist: true
            }).then(role => {
                this.updateElderRole(
                    guildID,
                    role.id
                )
                rolesAndChannelsIDs.elderID = role
                rolesAndChannels.elderRole = role
                this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
            })
        } else if (memberID == null) {
            guild.roles.create({
                name: "member",
                color: ColorsValues.colorRankMember,
                hoist: true
            }).then(role => {
                this.updateMemberRole(
                    guildID,
                    role.id
                )
                rolesAndChannelsIDs.memberID = role
                rolesAndChannels.memberRole = role
                this.prepareChannels(guild, rolesAndChannelsIDs)
            })
        } else if (rolesAndChannels.leaderRole === undefined) {
            rolesAndChannels.leaderRole = guild.roles.cache.get(leaderID)
            this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)

        } else if (rolesAndChannels.coleaderRole === undefined) {
            rolesAndChannels.coleaderRole = guild.roles.cache.get(coleaderID)
            this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
        } else if (rolesAndChannels.elderRole === undefined) {
            rolesAndChannels.elderRole = guild.roles.cache.get(elderID)
            this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
        } else if (rolesAndChannels.memberRole === undefined) {
            rolesAndChannels.memberRole = guild.roles.cache.get(memberID)
            this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
        } else {
            this.prepareChannels(guild, rolesAndChannelsIDs, rolesAndChannels)
        }
    }

    prepareRolesAndChannels(guild) {
        this.getRolesAndChannels(guild.id).then(rolesAndChannelsIDs => {
            const rolesAndChannels = {
                leaderRole: undefined,
                coleaderRole: undefined,
                elderRole: undefined,
                memberRole: undefined,
                commandsChannel: undefined
            }
            this.prepareRoles(guild, rolesAndChannelsIDs, rolesAndChannels)
        }).catch(r => console.log(r))
    }

    async connectGuild(guild) {
        const guildID = guild.id
        await this.guildsRepository.connectGuild(guildID)
        this.prepareRolesAndChannels(guild)
    }

    async getRolesAndChannels(guildID) {
        return this.guildsRepository.getRolesAndChannels(guildID)
    }

    getRoles(guildID) {
        return this.guildsRepository.getRoles(guildID)
    }

    async getRoleID(guildID, type) {
        switch (type) {
            case 1:
                return this.guildsRepository.getMemberRoleID(guildID)
            case 2:
                return this.guildsRepository.getElderRoleID(guildID)
            case 3:
                return this.guildsRepository.getColeaderRoleID(guildID)
            case 4:
                return this.guildsRepository.getLeaderRoleID(guildID)
        }
    }

    getLeaderRoleID(guildID) {
        return this.guildsRepository.getLeaderRoleID(guildID)
    }

    getColeaderRoleID(guildID) {
        return this.guildsRepository.getColeaderRoleID(guildID)
    }

    getElderRoleID(guildID) {
        return this.guildsRepository.getElderRoleID(guildID)
    }

    getMemberRoleID(guildID) {
        return this.guildsRepository.getMemberRoleID(guildID)
    }

    updateLeaderRole(guildID, roleID) {
        this.guildsRepository.updateLeaderRole(guildID, roleID)
    }

    updateColeaderRole(guildID, roleID) {
        this.guildsRepository.updateColeaderRole(guildID, roleID)
    }

    updateElderRole(guildID, roleID) {
        this.guildsRepository.updateElderRole(guildID, roleID)
    }

    updateMemberRole(guildID, roleID) {
        this.guildsRepository.updateMemberRole(guildID, roleID)
    }

    updateClanUpdatesChannel(guildID, channelID) {
        this.guildsRepository.updateClanUpdatesChannel(guildID, channelID)
    }

    updateCommandsChannel(guildID, channelID) {
        this.guildsRepository.updateCommandsChannel(guildID, channelID)
    }

    async getUpdatesChannelsForClan() {
        return await this.guildsRepository.getUpdatesChannelsForClan()
    }

    async getClanUpdateChannels(clanTag) {
        return await this.guildsRepository.getClanUpdateChannels(clanTag)
    }

    updateRiverRaceUpdatesChannel(guildID, channelID) {
        this.guildsRepository.updateRiverRaceUpdatesChannel(guildID, channelID)
    }

    // todo add roles to the top
    checkRoles(guild, role, ranksAdded = 0) {

        const {leader, coleader, elder, member} = role

        const rolesSize = guild.roles.cache.size
        const botTagPos = guild.roles.cache.map(role => role.name).indexOf("Royale Dot") - 1

        let roleData = null

        if (leader === null) {
            role.leader = 0
            roleData = {
                name: "leader",
                color: ColorsValues.colorRankLeader,
                hoist: true,
                position: rolesSize - botTagPos - ranksAdded
            }
        } else if (coleader === null) {
            role.coleader = 0
            roleData = {
                name: "co-leader",
                color: ColorsValues.colorRankColeader,
                hoist: true,
                position: rolesSize - botTagPos - ranksAdded
            }
        } else if (elder === null) {
            role.elder = 0
            roleData = {
                name: "elder",
                color: ColorsValues.colorRankElder,
                hoist: true,
                position: rolesSize - botTagPos - ranksAdded
            }
        } else if (member === null) {
            role.member = 0
            roleData = {
                name: "member",
                color: ColorsValues.colorRankMember,
                hoist: true,
                position: rolesSize - botTagPos - ranksAdded
            }
        }
        if (roleData !== null) {
            this.checkRoles(guild, role, ranksAdded + 1)
            guild.roles.create(roleData).then(role => {

            })
        }
    }
}

module.exports = {
    guildsHandler: new GuildsHandler()
}