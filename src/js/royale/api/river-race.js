const Response = require('../response')
const discordClient = require("../../discord/client");
const guildRepository = require("../../database/repository/guild-repository");
const riverRaceRepository = require("../../database/repository/river-race-repository");
const {RiverRace} = require("../../database/model/river-race");
const participantRepository = require("../../database/repository/participant-repository");
const {Participant} = require("../../database/model/participant");

class RiverRaceAPI extends Response {
    constructor(data) {
        super(data)

        this.initDetails()
        this.initClans()
        this.initBattleDays()
        this.initParticipantsList()

        const date = new Date();
        const month = date.getUTCMonth() + 1
        const year = date.getUTCFullYear()
        this.details.periodLogs.forEach(periodLog => {
            const {
                periodIndex,
                items
            } = periodLog
            items.forEach(item => {
                item.day = periodIndex + 1
                item.week = Math.floor(periodIndex / 7) + 1
                item.month = month
                item.year = year
                riverRaceRepository.insertRiverRace(
                    RiverRace.fromAPILogModel(item)
                )
            })
        })
        this.details.clans.forEach(clan => {
            clan.day = this.monthDay
            clan.week = this.week
            clan.month = month
            clan.year = year
            riverRaceRepository.insertCurrentRiverRace(
                RiverRace.fromAPIClanModel(clan)
            )
        })
        // console.log(this.details)
        delete this.data
    }

    initDetails() {
        this.details = this.data
        this.clan = this.details.clan
    }

    initParticipantsList() {
        const date = new Date();
        const month = date.getUTCMonth() + 1
        const year = date.getUTCFullYear()
        this.participants = this.details.clan.participants
        this.participants.forEach(participantAPI => {
            participantAPI.day = this.monthDay
            participantAPI.week = this.week
            participantAPI.month = month
            participantAPI.year = year
            const participantNew = Participant.fromAPIModel(participantAPI)
            participantRepository.getParticipant(
                participantNew
            ).then(participant => {
                participantRepository.insertParticipant(
                    participantNew
                )
                if (participant.exists) {
                    const diffDecksUsedToday = participantNew.decksUsedToday - participant.decksUsedToday
                    if (diffDecksUsedToday > 0 && participantNew.decksUsedToday === 4) {
                        participantNew.clan = this.clan
                        participantNew.name = participantAPI.name
                        this.handleAllDecksUsed(participantNew)
                    }
                } else {
                    if (participantNew.decksUsedToday === 4) {
                        participantNew.clan = this.clan
                        participantNew.name = participantAPI.name
                        this.handleAllDecksUsed(participantNew)
                    }
                }
            })
        })
        delete this.details.clan.participants
    }

    handleAllDecksUsed(participant) {
        const clanTag = participant.clan.tag
        guildRepository.getRiverRaceNewsChannelsByTag(clanTag).then(newsChannels => {
            discordClient.emit('clash-royale', {
                update: true,
                type: 'river-race-all-decks-used',
                clan: participant.clan,
                channels: newsChannels,
                member: participant,
            });
        })
    }

    initClans() {
        this.details.clans.forEach(clan => {
            let attacks = {
                boatAttacks: 0,
                participants: 0,
                decksUsed: 0,
                decksUsedToday: 0,
                repairPoints: 0
            }
            clan.participants.forEach(participant => {
                attacks.decksUsed += participant.decksUsed
                attacks.repairPoints += participant.repairPoints
                attacks.boatAttacks += participant.boatAttacks
                if (participant.decksUsedToday > 0) {
                    attacks.decksUsedToday += participant.decksUsedToday
                    attacks.participants += 1
                }
            })
            clan.attacks = attacks
        })
    }

    initBattleDays() {
        this.monthDay = this.details.periodIndex + 1;
        this.state = this.details.state;
        this.type = this.details.periodType;
        this.week = this.details.sectionIndex + 1;

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

    /**
     * The number of day from the start of this week
     */
    get day() {
        return this.monthDay % 7 || 7;
    }

    /**
     * The number of day from the start of this week
     */
    get battleDay() {
        return this.isTraining ? this.day : this.day - 3
    }

    get isTraining() {
        return this.details.periodType === 'training'
    }

    sortBy(sortType) {
        sortType = sortType + 1
        this.participants = this.participants.sort((m1, m2) => {
            switch (sortType) {
                case 1:
                    return m2.decksUsedToday - m1.decksUsedToday;
                case 2:
                    return m1.decksUsedToday - m2.decksUsedToday;
                case 3:
                    return m2.decksUsed - m1.decksUsed;
                case 4:
                    return m1.decksUsed - m2.decksUsed;
                case 5:
                    return m2.fame - m1.fame;
                case 6:
                    return m1.fame - m2.fame;
                case 7:
                    return m2.boatAttacks - m1.boatAttacks;
                case 8:
                    return m1.boatAttacks - m2.boatAttacks;
                case 9:
                    return m1.name.localeCompare(m2.name);
                case 10:
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
        const totalClanMembers = this.participants.length
        const members = this.participants.slice(
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

    paginateParticipants(sortType, page) {
        this.sortBy(sortType)
        return this.slice(page)
    }
}

module.exports = RiverRaceAPI