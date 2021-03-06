const {OnReady} = require("./events/on-ready");
const discordClient = require("./client");
const {OnClashRoyaleUpdate} = require("./events/on-clash-royale-update");
const {env} = require("../env");
const {OnGuild} = require("./events/on-guild");
const {OnInteractionCreate} = require("./events/on-interaction-create");

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
        // this.client.config = require("../../assets/config.json");

        this.bindEvents()
        this.login()
    }

    bindEvents() {
        OnReady.bind(this.client)
        OnGuild.bind(this.client)
        OnInteractionCreate.bind(this.client)
        OnClashRoyaleUpdate.bind(this.client)
    }

    login() {
        this.client.login(
            env.TOKEN
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