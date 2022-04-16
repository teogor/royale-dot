const {royaleRepository} = require("../royale/repository");
const guildRepository = require("../database/repository/guild-repository");
const CronJob = require('cron').CronJob;

class Refresher {

    constructor() {

    }

    initialize() {
        this.clansNews()
    }

    clansNews() {
        const jobUpdateClans = new CronJob('*/10 * * * * *', function () {
            guildRepository.getClanNewsChannels().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClan(updatesChannel.tag).catch(error => {
                        console.log(error)
                    })
                })
            })

        }, null, true, 'America/Los_Angeles');
        jobUpdateClans.start()
        const jobUpdateRiverRaces = new CronJob('0 */5 * * * *', function () {
            guildRepository.getRiverRaceNewsChannels().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClanRiverRace(updatesChannel.tag).catch(error => {
                        console.log(error)
                    })
                })
            })

        }, null, true, 'America/Los_Angeles');
        jobUpdateRiverRaces.start()
    }

}

module.exports = {
    refresher: new Refresher()
}