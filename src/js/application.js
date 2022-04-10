const {database} = require("./database");
const {discord} = require("./discord");

database.initialize()
discord.initialize()

const CronJob = require('cron').CronJob;
console.log('Before job instantiation');
const job = new CronJob('0 */1 * * * *', function () {
    const d = new Date();
    console.log('Every One Minutes:', d);
}, null, true, 'America/Los_Angeles');
console.log('After job instantiation');
job.start();