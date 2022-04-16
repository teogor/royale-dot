const sqlite3 = require('sqlite3')
const PlayerEntity = require("./entity/player-entity");
const PlayerDAO = require("./dao/player-dao");
const ClanEntity = require("./entity/clan-entity");
const ClanDAO = require("./dao/clan-dao");
const GuildEntity = require("./entity/guild-entity");
const GuildDAO = require("./dao/guild-dao");
const UserEntity = require("./entity/user-entity");
const UserDAO = require("./dao/user-dao");
const RiverRaceDAO = require("./dao/river-race-dao");
const ParticipantDAO = require("./dao/participant-dao");
const ParticipantEntity = require("./entity/participant-entity");
const RiverRaceEntity = require("./entity/river-race-entity");

const entities = [
    new ClanEntity(),
    new GuildEntity(),
    new ParticipantEntity(),
    new PlayerEntity(),
    new RiverRaceEntity(),
    new UserEntity(),
]

const daoClasses = [
    ClanDAO,
    GuildDAO,
    ParticipantDAO,
    PlayerDAO,
    RiverRaceDAO,
    UserDAO,
]

class RoyaleDotDatabase {

    constructor() {
        console.log("construct db")
        const databaseBuilderOptions = {
            path: './src/res/database/',
            name: 'royale-dot-db.sqlite3',
            entities
        }
        this.databaseBuilder(databaseBuilderOptions)
        // daoClasses.forEach(dao => {
        //     const name = dao.constructor.name
        //     this[lowercaseFirstLetter(name)] = dao
        // })
        this.clanDAO = new daoClasses[0](this)
        this.guildDAO = new daoClasses[1](this)
        this.participantDAO = new daoClasses[2](this)
        this.playerDAO = new daoClasses[3](this)
        this.riverRaceDAO = new daoClasses[4](this)
        this.userDAO = new daoClasses[5](this)
    }

    init() {

    }

    //#region EXECUTORS
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({id: this.lastID})
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    //#endregion EXECUTORS

    clear() {
        entities.forEach(entity => {
            this.dropEntity(entity)
        })
    }

    databaseBuilder({path, name, entities}) {
        this.db = new sqlite3.Database(`${path}${name}`, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
                this.prepareEntities(entities)
                // this.clear()
            }
        })
    }

    async getDatabaseManager() {
        const sqlCreateMaster = 'CREATE TABLE IF NOT EXISTS db_manager (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'table_name TEXT,' +
            'version INTEGER,' +
            'UNIQUE(table_name)' +
            ')'
        const sqlGetMaster = 'SELECT table_name AS tableName, version FROM db_manager'
        await this.run(sqlCreateMaster)
        return this.all(sqlGetMaster)
    }

    prepareDatabaseSchema() {
        const sqlCreateMaster = 'CREATE TABLE IF NOT EXISTS db_schema (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'table_name TEXT,' +
            'column_name TEXT,' +
            'data_type TEXT,' +
            'UNIQUE(table_name, column_name)' +
            ')'
        this.run(sqlCreateMaster).catch(_ => {
            console.log(_)
        })
    }

    insertIntoDatabaseManager(name, version) {
        if (!version) {
            version = 1
        }
        const sqlInsertMaster = 'INSERT or IGNORE INTO db_manager (table_name, version) VALUES (?, ?)'
        this.run(
            sqlInsertMaster,
            [name, version]
        ).catch(error => {
            console.error(error)
        })
    }

    insertIntoDatabaseSchema(tableName, tableModel) {
        Object.entries(tableModel).forEach(([_, column]) => {
            const {
                name,
                type,
            } = column
            const sqlInsertMaster = 'INSERT or IGNORE INTO db_schema (table_name, column_name, data_type) VALUES (?, ?, ?)'
            this.run(
                sqlInsertMaster,
                [tableName, name, type]
            ).catch(_ => {
                // nothing
            })
        })
    }

    removeFromDatabaseManager(name) {
        const sqlDeleteMaster = 'DELETE FROM db_manager WHERE table_name=?'
        this.run(
            sqlDeleteMaster,
            [name]
        ).catch(error => {
            console.error(error)
        })
        const sqlDeleteSchema = 'DELETE FROM db_schema WHERE table_name=?'
        this.run(
            sqlDeleteSchema,
            [name]
        ).catch(error => {
            console.error(error)
        })
    }

    prepareEntities() {
        this.prepareDatabaseSchema()
        this.getDatabaseManager().then(dbManager => {
            entities.forEach(entity => {
                this.createEntity(entity, dbManager)
            })
        })
    }

    createEntity(entity, dbManager) {
        const {
            tableName,
            tableModel,
            tableVersion,
            options,
        } = entity
        let sqlQuery = `CREATE TABLE IF NOT EXISTS ${tableName}`
        sqlQuery += ` (`
        const elements = []
        const columns = []
        // Object.values(tableModel).sort((c1, c2) => {
        //     return c1.name.localeCompare(c2.name)
        // }).forEach(column => {
        Object.values(tableModel).forEach(column => {
            const {
                name,
                type,
                primaryKey,
                autoIncrement
            } = column
            let sqlQuery = `${name} ${type}`
            if (primaryKey) {
                sqlQuery += ` PRIMARY KEY`
            }
            if (autoIncrement) {
                sqlQuery += ` AUTOINCREMENT`
            }
            elements.push(sqlQuery)
            columns.push({
                name,
                type
            })
        })
        if (options) {
            const {
                unique
            } = options
            if (unique) {
                elements.push(`UNIQUE(${unique.map(option => option.name).join(", ")})`)
            }
        }
        sqlQuery += elements.join(", ")
        sqlQuery += `)`
        this.run(sqlQuery).then(_ => {
            const tableData = dbManager.filter(db => db.tableName === tableName)[0]
            if (tableData) {
                if (tableData.version !== tableVersion && tableVersion !== undefined) {
                    this.updateEntity(entity, columns)
                }
            } else {
                this.insertIntoDatabaseManager(tableName, tableVersion)
                this.insertIntoDatabaseSchema(tableName, tableModel)
            }
        }).catch(error => {
            console.error(error)
        })
    }

    updateEntity(entity, columns) {
        const {
            tableName,
        } = entity
        const sqlAll = `SELECT column_name AS columnName, data_type AS dataType FROM db_schema WHERE table_name = ?`
        this.all(
            sqlAll,
            [tableName]
        ).then(table => {
            const addedColumns = []
            const modifiedColumns = []
            const queueElementsAdded = []
            const queueElementsModified = []
            columns.forEach(columnData => {
                const oldColumnData = table.filter(t => t.columnName === columnData.name)[0]
                if (oldColumnData === undefined) {
                    // column added
                    queueElementsAdded.push(`ADD ${columnData.name} ${columnData.type}`)
                    addedColumns.push(`VALUES (${tableName}, ${columnData.name}, ${columnData.type})`)
                } else if (oldColumnData.dataType !== columnData.type) {
                    // column type changed
                    queueElementsModified.push(`ALTER COLUMN ${columnData.name} ${columnData.type}`)
                    modifiedColumns.push(`UPDATE db_schema SET data_type=${columnData.type} WHERE table_name=${tableName} AND column_name=${columnData.name}`)
                    modifiedColumns.push({
                        columnName: columnData.name,
                        dataType: columnData.type,
                        oldDataType: oldColumnData.dataType
                    })
                }
            })
            const queryAlterAdd = `ALTER TABLE ${tableName} ${queueElementsAdded.join(",")}`
            const queryAlterModify = `ALTER TABLE ${tableName} ${queueElementsModified.join(",")}`
            let finalQuery
            if (queueElementsAdded.length > 0 && queueElementsModified.length > 0) {
                finalQuery = `${queryAlterAdd};${queryAlterModify}`
            } else if (queueElementsAdded.length > 0) {
                finalQuery = `${queryAlterAdd}`
            } else if (queueElementsModified.length > 0) {
                finalQuery = `${queryAlterModify}`
            }

            this.run(finalQuery).then(_ => {
                // add columns
                const sqlAddedColumns = 'INSERT or IGNORE INTO db_schema (table_name, column_name, data_type) ${addedColumns.join(",")}'
                const sqlModifiedColumns = modifiedColumns.join(";")
            })
        }).catch(error => {
            console.error(error)
        })
    }

    dropEntity(entity) {
        const {
            tableName,
        } = entity
        const sqlQuery = `DROP TABLE IF EXISTS ${tableName}`
        this.run(sqlQuery).then(_ => {
            this.removeFromDatabaseManager(tableName)
        }).catch(error => {
            console.error(error)
        })
    }

}

const royaleDotDB = new RoyaleDotDatabase()

module.exports = royaleDotDB