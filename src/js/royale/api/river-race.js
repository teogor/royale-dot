const Response = require('../response')

class RiverRace extends Response {
    constructor(data) {
        super(data)

        this.initDetails()
        this.initParticipantsList()
        this.initClans()
        this.initBattleDays()

        delete this.data
    }

    initDetails() {
        this.details = this.data
    }

    initParticipantsList() {
        this.details.participants = this.details.clan.participants
        delete this.details.clan.participants
    }

    initClans() {
        this.details.clans.forEach(clan => {
            let attacks = {
                participants: 0,
                decksUsed: 0,
                decksUsedToday: 0
            }
            clan.participants.forEach(participant => {
                attacks.decksUsed += participant.decksUsed
                if (participant.decksUsedToday > 0) {
                    attacks.decksUsedToday += participant.decksUsedToday
                    attacks.participants += 1
                }
            })
            clan.attacks = attacks
        })
    }

    initBattleDays() {
        switch (this.details.periodIndex) {
            case 1:
                this.details.battleDay = 4
                break
            case 2:
                this.details.battleDay = 3
                break
            case 3:
                this.details.battleDay = 2
                break
            case 4:
                this.details.battleDay = 1
                break
            case 5:
                this.details.battleDay = 3
                break
            case 6:
                this.details.battleDay = 2
                break
            case 7:
                this.details.battleDay = 1
                break
        }
        this.details.isTraining = this.details.periodType === 'training'
        if (this.isTraining) {
            delete this.details.periodLogs
            this.details.battleDays = false
        } else {
            const battleDays = []
            this.details.periodLogs.forEach(period => {
                const clans = []
                period.items.forEach(clan => {
                    clans.push({
                        clan: clan.clan.tag,
                        pointsEarned: clan.pointsEarned,
                        progressStartOfDay: clan.progressStartOfDay,
                        progressEndOfDay: clan.progressEndOfDay,
                        endOfDayRank: clan.endOfDayRank,
                        progressEarned: clan.progressEarned,
                        numOfDefensesRemaining: clan.numOfDefensesRemaining,
                        progressEarnedFromDefenses: clan.progressEarnedFromDefenses
                    })
                })
                battleDays.push({
                    day: period.periodIndex - 2,
                    clans
                })
            })
            this.details.battleDays = battleDays
        }
    }

    get isTraining() {
        return this.details.periodType === 'training'
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

module.exports = RiverRace