const Response = require('../response')
const {clansHandler} = require("../../database/handle/clans-handler");
const {playersHandler} = require("../../database/handle/players-handler");

class Clan extends Response {
    constructor(data) {
        super(data)

        this.initDetails()
        this.initMembers()

        delete this.data

        clansHandler.connectClan(this.details)
        if (this.members) {
            this.members.forEach(member => {
                member.clanTag = this.details.tag
                playersHandler.connectPlayer(member)
            })
        }
    }

    initDetails() {
        const details = this.data
        details.locationName = details.location.name
        details.locationIsCountry = details.location.isCountry
        delete details.location
        this.details = details
    }

    initMembers() {
        if (this.data.memberList) {
            const members = []
            this.data.memberList.forEach(member => {
                member.lastSeen = new Date(
                    member.lastSeen.slice(0, 4),
                    parseInt(member.lastSeen.slice(4, 6)) - 1,
                    member.lastSeen.slice(6, 8),
                    member.lastSeen.slice(9, 11),
                    member.lastSeen.slice(11, 13),
                    member.lastSeen.slice(13, 15)
                )
                switch (member.role.toUpperCase()) {
                    case "LEADER":
                        member.role = {
                            type: 4,
                            name: "leader",
                            nameUp: "Leader"
                        }
                        break
                    case "COLEADER":
                        member.role = {
                            type: 3,
                            name: "coleader",
                            nameUp: "Co-Leader"
                        }
                        break
                    case "ELDER":
                    case "ADMIN":
                        member.role = {
                            type: 2,
                            name: "elder",
                            nameUp: "Elder"
                        }
                        break
                    case "MEMBER":
                        member.role = {
                            type: 1,
                            name: "member",
                            nameUp: "Member"
                        }
                        break
                }
                members.push(member)
            })
            delete this.data.memberList
            this.members = members
        } else {
            this.members = false
        }
    }

    get leader() {
        if (!this.members) {
            return false
        }

        return this.members.filter(item => item.role === 'leader')[0]
    }

    get coleaders() {
        if (!this.members) {
            return false
        }

        return this.members.filter(item => item.role === 'coleader')
    }

    get elders() {
        if (!this.members) {
            return false
        }

        return this.members.filter(item => item.role === 'elder')
    }
}

module.exports = Clan