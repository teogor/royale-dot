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

    async connectGuild(guild) {
        const guildID = guild.id
        await this.guildsRepository.connectGuild(guildID)
        this.getRoles(guildID).then(role => {

            const {leader, coleader, elder, member} = role

            if (leader == null) {
                guild.roles.create({
                    name: "leader",
                    color: ColorsValues.colorRankLeader,
                    hoist: true
                }).then(role => {
                    this.updateLeaderRole(
                        guildID,
                        role.id
                    )
                })
            }
            if (coleader == null) {
                guild.roles.create({
                    name: "co-leader",
                    color: ColorsValues.colorRankColeader,
                    hoist: true
                }).then(role => {
                    this.updateColeaderRole(
                        guildID,
                        role.id
                    )
                })
            }
            if (elder == null) {
                guild.roles.create({
                    name: "elder",
                    color: ColorsValues.colorRankElder,
                    hoist: true
                }).then(role => {
                    this.updateElderRole(
                        guildID,
                        role.id
                    )
                })
            }
            if (member == null) {
                guild.roles.create({
                    name: "member",
                    color: ColorsValues.colorRankMember,
                    hoist: true
                }).then(role => {
                    this.updateMemberRole(
                        guildID,
                        role.id
                    )
                })
            }
        }).catch(r => console.log(r))
    }

    getRoles(guildID) {
        return this.guildsRepository.getRoles(guildID)
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
            this.checkRoles(guild, role, ranksAdded+1)
            guild.roles.create(roleData).then(role => {

            })
        }
    }
}

module.exports = {
    guildsHandler: new GuildsHandler()
}