const {guildsHandler} = require("../database2/handle/guilds-handler");
const {royaleRepository} = require("../royale/repository");
const CronJob = require('cron').CronJob;

class Refresher {

    constructor() {

    }

    initialize() {
        this.clansNews()
    }

    clansNews() {
        const jobUpdateClans = new CronJob('0 */2 * * * *', function () {
            guildsHandler.getUpdatesChannelsForClan().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClan(updatesChannel.clan_tag).then(result =>{

                    }).catch(error => {
                        console.log(error)
                    })
                })
            })

        }, null, true, 'America/Los_Angeles');
        jobUpdateClans.start()
        const jobUpdateRiverRaces = new CronJob('0 */5 * * * *', function () {
            guildsHandler.getRiverRaceNewsChannelsForClans().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClanRiverRace(updatesChannel.clan_tag).then(result =>{

                    }).catch(error => {
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