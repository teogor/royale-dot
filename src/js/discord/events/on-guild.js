const {Commands} = require("../commands");
const {guildsHandler} = require("../../database2/handle/guilds-handler");

class OnGuild {

    //#region VARIABLES
    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }

    get commands() {
        return this._commands;
    }

    set commands(value) {
        this._commands = value;
    }

    //#endregion VARIABLES

    static bind(client) {
        const onReady = new OnGuild(client)
        onReady.initialize()
        onReady.listen()
    }

    constructor(client) {
        this.client = client
    }

    initialize() {
        this.commands = new Commands(this.client)
    }

    listen() {
        this.client.on("guildCreate", guild => {
            this.handlePresence()
            this.commands.set(guild)
            guildsHandler
                .connectGuild(guild)
                .catch(error => {
                    console.error(error)
                })
        })

        this.client.on("guildDelete", guild => {
            this.handlePresence()
            guildsHandler
                .disconnectGuild(guild)
                .catch(error => {
                    console.error(error)
                })
        })
    }

    handlePresence() {
        const installedIn = this.client.guilds.cache.size
        this.client.user.setPresence({
            activities: [{
                name: `installed in ${installedIn} servers`,
                type: "PLAYING"
            }],
            status: "online"
        })
    }
}

module.exports = {
    OnGuild
}
