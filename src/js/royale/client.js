const Cards = require("./api/cards")
const {requester} = require("./requester")
const Clan = require("./api/clan");
const RiverRace = require("./api/river-race");
const Members = require("./api/members");
const Player = require("./api/player");

class RoyaleClient {

    constructor() {

    }

    async cards() {
        const response = await requester.get('cards')
        return new Cards(response)
    }

    async clans(params) {
        let query = params

        if (typeof params === 'string') {
            query = {name: params}
        }

        const response = await requester.get('clans', query)
        return new Clan(response)
    }

    async clan(tag) {
        const response = await requester.get(`clans/${encodeURIComponent(tag)}`)
        return new Clan(response)
    }

    async clanRiverRace(tag) {
        const response = await requester.get(`clans/${encodeURIComponent(tag)}/currentriverrace`)
        return new RiverRace(response)
    }

    async clanRiverRaceLog(tag) {
        const response = await requester.get(`clans/${encodeURIComponent(tag)}/riverracelog`)
        return new Clan(response)
    }

    async clanMembers(tag) {
        const response = await requester.get(`clans/${encodeURIComponent(tag)}/members`)
        return new Members(response)
    }

    async player(tag) {
        const response = await requester.get(`players/${encodeURIComponent(tag)}`)
        return new Player(response)
    }
}

module.exports = {
    royaleClient: new RoyaleClient()
}