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
}

class User {
    constructor() {
        this.id=0
        this.createdAt=""
        this.updatedAt=""
        this.userId=""
        this.tag=""
        this.linkedAt=""
    }
}

module.exports = {
    User,
    userModel
}