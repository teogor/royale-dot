const Response = require('../response')

class Members extends Response {
    constructor(data) {
        super(data)

        this.items = this.data

        const memberList = []
        this.total = this.items.length
        this.items.forEach(member => {
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
            memberList.push(member)
        })
        this.items = memberList

        delete this.data
    }

    sortBy(sortType) {
        this.items = this.items.sort((m1, m2) => {
            switch (sortType) {
                case 1:
                    return m1.clanRank - m2.clanRank;
                case 2:
                    return m2.clanRank - m1.clanRank;
                case 3:
                    return m2.expLevel - m1.expLevel;
                case 4:
                    return m1.expLevel - m2.expLevel;
                case 5:
                    return m2.donations - m1.donations;
                case 6:
                    return m1.donations - m2.donations;
                case 7:
                    return m2.donationsReceived - m1.donationsReceived;
                case 8:
                    return m1.donationsReceived - m2.donationsReceived;
                case 9:
                    return m1.lastSeen - m2.lastSeen;
                case 10:
                    return m2.lastSeen - m1.lastSeen;
                case 11:
                    return m1.name.localeCompare(m2.name);
                case 12:
                    return m2.name.localeCompare(m1.name);
                default:
                    return 0;
            }
        })
        return this.items
    }

    slice(page) {
        const indexTop = parseInt(page) * 10
        const indexBottom = (parseInt(page) + 1) * 10
        const totalClanMembers = this.total
        const members = this.items.slice(
            indexTop,
            indexBottom
        )
        if (indexBottom >= totalClanMembers) {
            return {
                clanMembersSorted: members,
                reachedTop: true
            }
        } else {
            return {
                clanMembersSorted: members,
                reachedTop: false
            }
        }
    }

    paginate(sortType, page) {
        this.sortBy(sortType)
        return this.slice(page)
    }

    get leader() {
        if (!this.memberList) {
            return false
        }

        return this.memberList.filter(item => item.role === 'leader')[0]
    }

    get coleaders() {
        if (!this.memberList) {
            return false
        }

        return this.memberList.filter(item => item.role === 'coleader')
    }

    get elders() {
        if (!this.memberList) {
            return false
        }

        return this.memberList.filter(item => item.role === 'elder')
    }
}

module.exports = Members