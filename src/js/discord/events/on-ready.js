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
        const getEmoji = false
        this.client.on("ready", () => {
            if (!getEmoji) {
                this.deleteOldCommands()
                this.handlePresence()
                this.handleGuilds()
            } else {
                this.client.guilds.cache.filter(guild => guild.name.startsWith('royale-dot-')).each(guild => {
                    console.log(`${guild.name} -> ${guild.emojis.cache.size}`)
                    guild.emojis.cache.forEach(emoji => {
                        console.log(`${emoji.name}: '<:${emoji.name}:${emoji.id}>',`)
                    })
                })
            }
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
        const installedIn = this.client.guilds.cache.size
        this.client.user.setPresence({
            activities: [{
                name: `installed in ${installedIn} servers`,
                type: "PLAYING"
            }],
            status: "online"
        })
    }

    handleGuilds() {
        this.client.guilds.cache.filter(guild => !guild.name.startsWith('royale-dot-')).each(guild => {
            this.commands.set(guild)
            guildsHandler
                .connectGuild(guild)
                .catch(error => {
                    console.error(error)
                })

        })
    }
}

module.exports = {
    OnReady
}
