class GuildsRepository {
    constructor(dao) {
        this.dao = dao
    }

    deleteTable() {
        return this.dao.run(`DROP TABLE guilds`)
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS guilds (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  guild_id TEXT UNIQUE,
                  created_at TEXT,
                  updated_at TEXT,
                  role_leader_id TEXT,
                  role_coleader_id TEXT,
                  role_elder_id TEXT,
                  role_member_id TEXT,
                  clan_updates_channel_id TEXT,
                  river_race_updates_channel_id TEXT
            )`
        return this.dao.run(sql)
    }

    async connectGuild(guildID) {
        await this.dao.run(
            'INSERT or IGNORE INTO guilds (guild_id, created_at, updated_at) VALUES (?, ?, ?)',
            [guildID, Date.now(), Date.now()])
    }

    updateLeaderRole(guildID, role_id) {
        return this.dao.run(
            `UPDATE guilds SET role_leader_id = ? WHERE guild_id = ?`,
            [role_id, guildID]
        )
    }

    updateColeaderRole(guildID, role_id) {
        return this.dao.run(
            `UPDATE guilds SET role_coleader_id = ? WHERE guild_id = ?`,
            [role_id, guildID]
        )
    }

    updateElderRole(guildID, role_id) {
        return this.dao.run(
            `UPDATE guilds SET role_elder_id = ? WHERE guild_id = ?`,
            [role_id, guildID]
        )
    }

    updateMemberRole(guildID, role_id) {
        return this.dao.run(
            `UPDATE guilds SET role_member_id = ? WHERE guild_id = ?`,
            [role_id, guildID]
        )
    }

    updateClanUpdatesChannel(guildID, channelID) {
        return this.dao.run(
            `UPDATE guilds SET clan_updates_channel_id = ? WHERE guild_id = ?`,
            [channelID, guildID]
        )
    }

    updateRiverRaceUpdatesChannel(guildID, channelID) {
        return this.dao.run(
            `UPDATE guilds SET river_race_updates_channel_id = ? WHERE guild_id = ?`,
            [channelID, guildID]
        )
    }

    getRoles(guildID) {
        return this.dao.get(`SELECT role_leader_id AS leader,
      role_coleader_id AS coleader,
      role_elder_id AS elder,
      role_member_id AS member FROM guilds WHERE guild_id = ? LIMIT 1`,
            [guildID])
    }

    getLeaderRoleID(guildID) {
        return this.dao.get(`SELECT role_leader_id AS id FROM guilds WHERE guild_id = ? LIMIT 1`, [guildID])
    }

    getColeaderRoleID(guildID) {
        return this.dao.get(`SELECT role_coleader_id AS id FROM guilds WHERE guild_id = ? LIMIT 1`, [guildID])
    }

    getElderRoleID(guildID) {
        return this.dao.get(`SELECT role_elder_id AS id FROM guilds WHERE guild_id = ? LIMIT 1`, [guildID])
    }

    getMemberRoleID(guildID) {
        return this.dao.get(`SELECT role_member_id AS id FROM guilds WHERE guild_id = ? LIMIT 1`, [guildID])
    }

    getClanUpdateChannels(clanTag) {
        return this.dao.all(
            `SELECT g.clan_updates_channel_id AS channelId FROM linked_clans lc JOIN guilds g ON lc.guild_id = g.guild_id WHERE lc.clan_tag = ?`,
            [clanTag]
        )
    }
}

module.exports = {GuildsRepository}