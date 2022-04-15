// const {database} = require("./database2");
const {discord} = require("./discord");
const {homePage} = require("./homepage");
const {isReleaseBuild} = require("./utils/dev");
const {refresher} = require("./cron/Refresher");

const databaseClean = false

if (databaseClean) {
    // database.clean()
} else {
    // database.initialize()
    discord.initialize()
    refresher.initialize()
    if (isReleaseBuild()) {
        homePage.initialize()
    }
}