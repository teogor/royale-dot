const {database} = require("./database");
const {discord} = require("./discord");
const {homePage} = require("./homepage");
const {royaleRepository} = require("./royale/repository");
const {guildsHandler} = require("./database/handle/guilds-handler");

database.initialize()
discord.initialize()
homePage.initialize()

const CronJob = require('cron').CronJob;
const jobUpdateClans = new CronJob('*/20 * * * * *', function () {
    guildsHandler.getUpdatesChannelsForClan().then(updatesChannels => {
        updatesChannels.forEach(updatesChannel => {
            royaleRepository.getClan(updatesChannel.clan_tag).then(result =>{

            }).catch(error => {
                console.log(error)
            })
        })
    })

}, null, true, 'America/Los_Angeles');
jobUpdateClans.start();
const jobUpdatePlayers = new CronJob('0 */30 * * * *', function () {
    guildsHandler.getUpdatesChannelsForClan().then(updatesChannels => {
        updatesChannels.forEach(updatesChannel => {
            royaleRepository.getClan(updatesChannel.clan_tag).then(result =>{

            }).catch(error => {
                console.log(error)
            })
        })
    })

}, null, true, 'America/Los_Angeles');
// jobUpdatePlayers.start();