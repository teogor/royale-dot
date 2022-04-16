const {Guild} = require("../model/guild");
const royaleDotDB = require("../royale-dot-database");

class GuildDAO {

    constructor(db) {
        this.db = db
    }

    async insertGuild(guild) {
        const sql = `INSERT or IGNORE INTO guilds(guild_id, created_at, updated_at) VALUES (?, ?, ?)`
        const values = [
            guild.guildId,
            Date.now(),
            Date.now()
        ]
        return this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    async getGuild(guildId) {
        const sql = `SELECT * FROM guilds WHERE guild_id=?`
        const values = [
            guildId
        ]

        const guildDB = await this.db.get(
            sql,
            values
        )

        return Guild.fromDatabaseModel(guildDB)
    }

    updateRoles(guild) {
        const sql = `UPDATE guilds SET 
                    role_leader_id=?,role_coleader_id=?,role_elder_id=?,role_member_id=? 
                    WHERE guild_id=?`
        const values = [
            guild.roleLeaderId,
            guild.roleColeaderId,
            guild.roleElderId,
            guild.roleMemberId,
            guild.guildId
        ]

        this.db.run(
            sql,
            values
        )
    }

    updateChannels(guild) {
        const sql = `UPDATE guilds SET 
                    channel_clan_news_id=?,channel_river_race_news_id=?,channel_commands_id=? 
                    WHERE guild_id=?`
        const values = [
            guild.channelClanNewsId,
            guild.channelRiverRaceNewsId,
            guild.channelCommandsId,
            guild.guildId
        ]

        this.db.run(
            sql,
            values
        )
    }

    async getClanNewsChannels() {
        const sql = `SELECT g.guild_id AS guildId,
             g.channel_clan_news_id AS channelClanNewsId,
             g.tag AS tag
             FROM guilds g
             WHERE g.channel_clan_news_id IS NOT NULL AND g.tag IS NOT NULL`

        return await this.db.all(
            sql
        )
    }

    async getRiverRaceNewsChannels() {
        const sql = `SELECT g.guild_id AS guildId,
             g.channel_river_race_news_id AS channelRiverRaceNewsId,
             g.tag AS tag
             FROM guilds g
             WHERE g.channel_river_race_news_id IS NOT NULL AND g.tag IS NOT NULL`

        return await this.db.all(
            sql
        )
    }

    async getClanNewsChannelsByTag(tag) {
        const sql = `SELECT g.guild_id AS guildId,
             g.channel_clan_news_id AS channelClanNewsId,
             g.tag AS tag
             FROM guilds g
             WHERE g.channel_clan_news_id IS NOT NULL AND g.tag=?`
        const values = [
            tag
        ]

        return await this.db.all(
            sql,
            values
        )
    }

    async getRiverRaceNewsChannelsByTag(tag) {
        const sql = `SELECT g.guild_id AS guildId,
             g.channel_river_race_news_id AS channelRiverRaceNewsId,
             g.tag AS tag
             FROM guilds g
             WHERE g.channel_river_race_news_id IS NOT NULL AND g.tag=?`
        const values = [
            tag
        ]

        return await this.db.all(
            sql,
            values
        )
    }

    async linkClan(guild) {
        const sql = `UPDATE guilds SET tag=?,linked_at=?,updated_at=? WHERE guild_id=?`
        const values = [
            guild.tag,
            Date.now(),
            Date.now(),
            guild.guildId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async unlinkClan(guild) {
        const sql = `UPDATE guilds SET tag=?,updated_at=? WHERE guild_id=?`
        const values = [
            null,
            Date.now(),
            guild.guildId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async setClanNewsChannels(guild) {
        const sql = `UPDATE guilds SET channel_clan_news_id=?,updated_at=? WHERE guild_id=?`
        const values = [
            guild.channelClanNewsId,
            Date.now(),
            guild.guildId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async setRiverRaceNewsChannels(guild) {
        const sql = `UPDATE guilds SET channel_river_race_news_id=?,updated_at=? WHERE guild_id=?`
        const values = [
            guild.channelRiverRaceNewsId,
            Date.now(),
            guild.guildId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async getRiverRaceNewsChannelsFor(hours, minutes) {
        const sql = `SELECT g.guild_id                   AS guildId,
                           g.channel_river_race_news_id AS channelRiverRaceNewsId,
                           g.tag                        AS tag,
                           r.minutes,
                           r.hours
                    FROM guilds g
                    INNER JOIN reports r on g.guild_id = r.guild_id
                    WHERE g.channel_river_race_news_id IS NOT NULL
                      AND g.tag IS NOT NULL AND r.hours=? AND r.minutes=? AND r.type=1`

        return this.db.all(
            sql,
            [hours, minutes]
        )
    }

}

module.exports = GuildDAO