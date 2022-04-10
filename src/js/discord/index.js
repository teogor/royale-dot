const {Client, Intents} = require("discord.js");
const {OnReady} = require("./events/on-ready");
const {OnInteractionCreate} = require("./events/on-interaction-create");
const discordClient = require("./client");
const {OnClashRoyaleUpdate} = require("./events/on-clash-royale-update");

class Discord {

    //#region VARIABLES
    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.client = discordClient;
    }

    initialize() {
        this.client.config = require("../../assets/config.json");

        this.bindEvents()
        this.login()
    }

    bindEvents() {
        OnReady.bind(this.client)
        OnInteractionCreate.bind(this.client)
        OnClashRoyaleUpdate.bind(this.client)
    }

    login() {
        this.client.login(
            this.client.config.token
        ).then(() => {
            console.log("Logged In!")
        }).catch(error => {
            console.error(error)
        })
    }
}

module.exports = {
    discord: new Discord()
}