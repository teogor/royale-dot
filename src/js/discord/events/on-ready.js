const {Commands} = require("../commands");
const {guildsHandler} = require("../../database/handle/guilds-handler");

class OnReady {

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
        const onReady = new OnReady(client)
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
        this.client.on("ready", () => {
            this.deleteOldCommands()
            this.handlePresence()
            this.handleGuilds()
        });
    }

    deleteOldCommands() {
        this.client.application.commands.fetch().then(commands => {
            commands.forEach(command => {
                command.delete().catch(
                    error => console.log(error)
                )
            })
        })
    }

    handlePresence() {
        console.log(`${this.client.user.tag} is up and ready to go!`)
        this.client.user.setPresence({
            activities: [{
                name: "Clash Royale v" + this.getRandomArbitrary(100, 999),
                type: "PLAYING"
            }],
            status: "online"
        })
    }

    handleGuilds() {
        this.client.guilds.cache.each(guild => {
            this.commands.set(guild)
            guildsHandler
                .connectGuild(guild)
                .catch(error => {
                    console.error(error)
                })

        })
    }

    getRandomArbitrary(min, max) {
        return Math.trunc(Math.random() * (max - min) + min);
    }
}

module.exports = {
    OnReady
}
