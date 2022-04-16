const {toUppercaseWords} = require("../../utils/functions");
const userModel = {
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
    userId: {
        name: 'user_id',
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
    commandsUsed: {
        name: 'commands_used',
        type: 'BIGINT',
    },
}

class User {

    /**
     * @param userDB
     */
    static fromDatabaseModel(userDB) {
        const user = new User()
        Object.entries(userDB).forEach(([key, value]) => {
            user[toUppercaseWords(key)] = value
        })
        return user
    }

    /**
     * @param userId
     */
    static fromID(userId) {
        const user = new User()
        user.userId = userId
        return user
    }

    /**
     * @param tag
     */
    static fromTag(tag) {
        const user = new User()
        user.tag = tag
        return user
    }

    constructor() {
        this.id = 0
        this.createdAt = ""
        this.updatedAt = ""
        this.userId = ""
        this.tag = ""
        this.linkedAt = ""
        this.commandsUsed = 0
    }

    get isLinked() {
        return this.tag !== null
    }
}

module.exports = {
    User,
    userModel
}