const {Collection} = require("discord.js");
const {playerSlashCommands} = require("./player");
const {clanSlashCommands} = require("./clan");
const {pingSlashCommands} = require("./ping");
const {adminSlashCommands} = require("./admin");

class Commands {

    //#region VARIABLES
    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }
    get slashCommands() {
        return this._slashCommands;
    }

    set slashCommands(value) {
        this._slashCommands = value;
    }

    //#endregion VARIABLES

    constructor(client) {
        this.client = client

        this.initialize()
    }

    initialize() {
        this.client.commands = new Collection();
        this.client.slashCommands = new Collection();

        this.slashCommands = []
        this.slashCommands.push(playerSlashCommands.slashCommand)
        this.slashCommands.push(clanSlashCommands.slashCommand)
        this.slashCommands.push(pingSlashCommands.slashCommand)
        this.slashCommands.push(adminSlashCommands.slashCommand)

        this.client.slashCommands = this.slashCommands
    }

    set(guild) {
        guild.commands.set(
            this.slashCommands
        ).then(() => {
            // empty
        }).catch(error => {
            console.error(error)
        })
    }
}

module.exports = {
    Commands
}
