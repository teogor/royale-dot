const {linkedClansHandler} = require("../../database/handle/linked-clans-handler");
const discordClient = require("../client");

class OnClashRoyaleUpdate {

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
        const onClashRoyaleUpdate = new OnClashRoyaleUpdate(client)
        onClashRoyaleUpdate.listen()
    }

    constructor(client) {
        this.client = client
    }

    listen() {
        this.client.on("clash-royale", async (data) => {
            // const guildsIds = []
            // const guildsDb = await linkedClansHandler.getGuilds(data.tag)
            // guildsDb.forEach(guild => guildsIds.push(guild.guild_id))
            // const channel2 = await discordClient.channels.fetch(channel.id)
            // this.client.guilds.cache.forEach(guild => {
            //     if (guildsIds.includes(guild.id)) {
            //         console.log("good job!")
            //         console.log(guild)
            //     }
            // })
            console.log(data)
            if (data.type === 'clan-update') {
                let whatsChanged = ""
                data.elements.forEach(element => {
                    whatsChanged += `${element.item}: ~~${element.oldValue}~~ -> ${element.newValue}\n`
                })
                data.channelsId.forEach(channelId => {
                    discordClient.channels.fetch(channelId).then(channel => {
                        channel.send(whatsChanged)
                    })
                })
            }
        })
    }
}

module.exports = {
    OnClashRoyaleUpdate
}
