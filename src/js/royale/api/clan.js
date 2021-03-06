const Response = require('../response')
const {Clan} = require("../../database/model/clan");
const clanRepository = require("../../database/repository/clan-repository");
const playerRepository = require("../../database/repository/player-repository");
const {Player} = require("../../database/model/player");
const {onCheckClan} = require("../../database/mapper/clan");

class ClanAPI extends Response {
    constructor(data) {
        super(data)

        this.initDetails()
        this.initMembers()

        delete this.data

        const clan = Clan.fromAPIModel(this.details)
        onCheckClan(clan)
        playerRepository.getByClan(this.tag).then(players => {
            const m1 = players.map(m => m.tag)
            const m2 = this.members.map(m => m.tag)
            let membersLeft = m1.filter(x => !m2.includes(x));
            let membersJoined = m2.filter(x => !m1.includes(x));
            this.members.forEach(member => {
                member.clan = {
                    tag: this.tag,
                    name: this.details.name,
                    badgeId: this.details.badgeId
                }
                if (membersJoined.includes(member.tag)) {
                    member.joined = true
                    const index = m2.indexOf(member.tag);
                    if (index !== -1) {
                        m2.splice(index, 1);
                    }
                }
                const player = Player.fromAPIMemberModel(member)
                playerRepository.insertFromMember(player)
            })
            players.filter(m => membersLeft.includes(m.tag)).forEach(member => {
                member.clan = {
                    tag: this.tag,
                    name: this.details.name,
                    badgeId: this.details.badgeId
                }
                member.left = true
                const index = m2.indexOf(member.tag);
                if (index !== -1) {
                    m2.splice(index, 1);
                }
                const player = Player.fromAPIMemberLeftModel(member)
                playerRepository.insertFromMember(player)
            })
            // todo handle remained players `m2`
        })
    }

    initDetails() {
        const details = this.data
        details.locationName = details.location.name
        details.locationIsCountry = details.location.isCountry
        delete details.location
        this.details = details
        this.tag = this.data.tag
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

module.exports = ClanAPI