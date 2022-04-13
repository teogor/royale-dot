const {Collection} = require("discord.js");
const interactionHandler = require("../interactions");
const {pingSlashCommands} = require("./ping");
const {clanSlashCommands} = require("./clan");
const {playerSlashCommands} = require("./player");
const {setSlashCommands} = require("./set");

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

        this.slashCommands = [
            clanSlashCommands,
            pingSlashCommands,
            playerSlashCommands,
            setSlashCommands
        ]

        this.client.slashCommands = this.slashCommands
        this.client.onInteractionCreated = interactionHandler
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
