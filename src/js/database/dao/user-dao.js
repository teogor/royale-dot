const {Player} = require("../model/player");
const {User} = require("../model/user");
const royaleDotDB = require("../royale-dot-database");

class UserDAO {

    constructor(db) {
        this.db = db
    }

    insertUser(user) {
        const sql = `INSERT or IGNORE INTO 
            users(user_id, commands_used, created_at, updated_at) VALUES (?, ?, ?, ?)`
        const values = [
            user.userId,
            0,
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

    updateCommands(user) {

    }

    async getUser(user) {
        const sql = `SELECT * FROM users WHERE user_id=?`
        const values = [
            user.userId
        ]

        const userDB = await this.db.get(
            sql,
            values
        )

        if (userDB === undefined) {
            await this.insertUser(user)
            return user
        }
        return User.fromDatabaseModel(userDB)
    }

    async linkPlayer(user) {
        const sql = `UPDATE users SET tag=?,linked_at=?,updated_at=? WHERE user_id=?`
        const values = [
            user.tag,
            Date.now(),
            Date.now(),
            user.userId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async unlinkPlayer(user) {
        const sql = `UPDATE users SET tag=?,updated_at=? WHERE user_id=?`
        const values = [
            null,
            Date.now(),
            user.userId
        ]

        return this.db.run(
            sql,
            values
        )
    }

    async getLinkedPlayer(user) {
        const sql = `SELECT COUNT(u.id) as isLinked,
                           p.tag,
                           p.name
                    FROM users u
                    LEFT JOIN players p on u.tag = p.tag
                    WHERE u.user_id=?`
        return this.db.get(
            sql,
            [user.userId]
        )
    }

    async checkPlayerLinked(user) {
        const sql = `SELECT COUNT(u.id) as isLinked,
                           u.user_id as  userId
                    FROM users u
                    WHERE u.tag=?`
        return this.db.get(
            sql,
            [user.tag]
        )
    }

}

module.exports = UserDAO