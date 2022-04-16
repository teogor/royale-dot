const {Clan} = require("../model/clan");

class ClanDAO {

    constructor(db) {
        this.db = db
    }

    insertClan(clan) {
        const {
            tag,
            name,
            type,
            description,
            badgeId,
            clanScore,
            clanWarTrophies,
            requiredTrophies,
            donationsPerWeek,
            members,
            locationName,
            locationIsCountry
        } = clan
        const insertColumns = [
            'tag',
            'name',
            'type',
            'description',
            'badge_id',
            'clan_score',
            'clan_war_trophies',
            'required_trophies',
            'donations_per_week',
            'members',
            'location_name',
            'location_is_country',
            'created_at',
            'updated_at',
        ]
        const columnsValuesQ = '?,?,?,?,?,?,?,?,?,?,?,?,?,?'
        const updateColumns = [
            'name=?',
            'type=?',
            'description=?',
            'badge_id=?',
            'clan_score=?',
            'clan_war_trophies=?',
            'required_trophies=?',
            'donations_per_week=?',
            'members=?',
            'location_name=?',
            'location_is_country=?',
            'updated_at=?',
        ]
        const values = [
            tag,
            name,
            type,
            description,
            badgeId,
            clanScore,
            clanWarTrophies,
            requiredTrophies,
            donationsPerWeek,
            members,
            locationName,
            locationIsCountry ? 1 : 0,
            Date.now(),
            Date.now(),
            name,
            type,
            description,
            badgeId,
            clanScore,
            clanWarTrophies,
            requiredTrophies,
            donationsPerWeek,
            members,
            locationName,
            locationIsCountry ? 1 : 0,
            Date.now(),
            tag
        ]
        const sqlInsert = `INSERT INTO clans(${insertColumns.join(",")}) VALUES(${columnsValuesQ})`
        const sqlOnConflict = `ON CONFLICT(tag) DO UPDATE SET ${updateColumns.join(",")}`
        const sqlTarget = `WHERE tag=?`
        const sql = `${sqlInsert} ${sqlOnConflict} ${sqlTarget}`
        this.db.run(
            sql,
            values
        ).catch(error => {
            console.log(error)
        })
    }

    async getClan(tag) {
        const sql = `SELECT * FROM clans WHERE tag=?`
        const values = [
            tag
        ]

        const clanDB = await this.db.get(
            sql,
            values
        )

        return Clan.fromDatabaseModel(clanDB)
    }

    async getRecommendedClans(keyword) {
        if (keyword === undefined || keyword === null) {
            keyword = ''
        }
        keyword = `%${keyword.replace(/\s/g, '').split("").join("%")}%`
        return this.db.all(
            `SELECT c.tag, c.name
            FROM clans c
            WHERE c.name LIKE ? OR c.tag = ?`,
            [keyword, keyword]
        )
    }
}

module.exports = ClanDAO