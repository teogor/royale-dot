const guildModel = {
    // id
    id: {
        name: 'id',
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true
    },
    // timestamps
    createdAt: {
        name: 'created_at',
        type: 'TEXT',
    },
    updatedAt: {
        name: 'updated_at',
        type: 'TEXT',
    },
    // data
    guildId: {
        name: 'guild_id',
        type: 'TEXT',
    },
    roleLeaderId: {
        name: 'role_leader_id',
        type: 'TEXT',
    },
    roleColeaderId: {
        name: 'role_coleader_id',
        type: 'TEXT',
    },
    roleElderId: {
        name: 'role_elder_id',
        type: 'TEXT',
    },
    roleMemberId: {
        name: 'role_member_id',
        type: 'TEXT',
    },
    channelClanNewsId: {
        name: 'channel_clan_news_id',
        type: 'TEXT',
    },
    channelRiverRaceNewsId: {
        name: 'channel_river_race_news_id',
        type: 'TEXT',
    },
    channelCommandsId: {
        name: 'channel_commands_id',
        type: 'TEXT',
    },
    tag: {
        name: 'tag',
        type: 'TEXT',
    },
    linkedAt: {
        name: 'linked_at',
        type: 'TEXT',
    },
}

class Guild {
    constructor() {
        this.id = 0
        this.updatedAt = ""
        this.createdAt = ""
        this.guildId = ""
        this.roleLeaderId = ""
        this.roleColeaderId = ""
        this.roleElderId = ""
        this.roleMemberId = ""
        this.channelClanNewsId = ""
        this.channelRiverRaceNewsId = ""
        this.channelCommandsId = ""
        this.tag=""
        this.linkedAt=""
    }
}

module.exports = {
    Guild,
    guildModel
}