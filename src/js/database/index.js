const {AppDAO} = require("./dao");
const {GuildsRepository} = require("./repository/guilds-repository");
const {ClansRepository} = require("./repository/clans-repository");
const {PlayersRepository} = require("./repository/players-repository");
const {LinkedAccountsRepository} = require("./repository/linked-accounts-repository");
const {LinkedClansRepository} = require("./repository/linked-clans-repository");
const {UsersRepository} = require("./repository/users-repository");

class Database {

    //#region VARIABLES
    get guildsRepository() {
        return this._guildsRepository;
    }

    set guildsRepository(value) {
        this._guildsRepository = value;
    }

    get clansRepository() {
        return this._clansRepository;
    }

    set clansRepository(value) {
        this._clansRepository = value;
    }

    get playersRepository() {
        return this._playersRepository;
    }

    set playersRepository(value) {
        this._playersRepository = value;
    }

    get linkedAccountsRepository() {
        return this._linkedAccountsRepository;
    }

    set linkedAccountsRepository(value) {
        this._linkedAccountsRepository = value;
    }

    get linkedClansRepository() {
        return this._linkedClansRepository;
    }

    set linkedClansRepository(value) {
        this._linkedClansRepository = value;
    }

    get usersRepository() {
        return this._usersRepository;
    }

    set usersRepository(value) {
        this._usersRepository = value;
    }
    //#endregion VARIABLES

    constructor() {
        this.guildsRepository = new GuildsRepository(AppDAO)
        this.usersRepository = new UsersRepository(AppDAO)
        this.clansRepository = new ClansRepository(AppDAO)
        this.playersRepository = new PlayersRepository(AppDAO)
        this.linkedAccountsRepository = new LinkedAccountsRepository(AppDAO)
        this.linkedClansRepository = new LinkedClansRepository(AppDAO)
    }

    initialize() {
        // guilds
        // this.guildsRepository.deleteTable()
        this.guildsRepository.createTable()

        // clans
        // this.clansRepository.deleteTable()
        this.clansRepository.createTable()

        // linked clans (clan <-> guild)
        // this.linkedClansRepository.deleteTable()
        this.linkedClansRepository.createTable()

        // ------------------------------------------------

        // // users
        // this.usersRepository.deleteTable()
        this.usersRepository.createTable()
        //
        // // players
        // this.playersRepository.deleteTable()
        this.playersRepository.createTable()
        //
        // // linked accounts (player <-> user)
        // this.linkedAccountsRepository.deleteTable()
        this.linkedAccountsRepository.createTable()
    }
}

module.exports = {
    database: new Database()
}