const {royaleRepository} = require("../royale/repository");
const guildRepository = require("../database/repository/guild-repository");
const discordClient = require("../discord/client");
const CronJob = require('cron').CronJob;

class Refresher {

    constructor() {
        this.clansNews = new CronJob('* */2 * * * *', function () {
            guildRepository.getClanNewsChannels().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClan(updatesChannel.tag).catch(error => {
                        console.log(error)
                    })
                })
            })

        }, null, true, 'America/Los_Angeles');

        this.riverRaceNews = new CronJob('* */5 * * * *', function () {
            guildRepository.getRiverRaceNewsChannels().then(updatesChannels => {
                updatesChannels.forEach(updatesChannel => {
                    royaleRepository.getClanRiverRace(updatesChannel.tag).catch(error => {
                        console.log(error)
                    })
                })
            })

        }, null, true, 'America/Los_Angeles');

        this.riverRacePeriodicNews = new CronJob('* 0,15,30,45 * * * *', function () {
            const hours = new Date().getHours()
            const minutes = new Date().getMinutes()
            guildRepository.getRiverRaceNewsChannelsFor(hours, minutes).then(updatesChannels => {
                discordClient.emit('clash-royale', {
                    update: true,
                    type: 'river-race-news',
                    channels: updatesChannels,
                });
            })
        }, null, true, 'America/Los_Angeles');
    }

    initialize() {
        this.clansNews.start()
        this.riverRaceNews.start()
        this.riverRacePeriodicNews.start()
    }

}

module.exports = {
    refresher: new Refresher()
}