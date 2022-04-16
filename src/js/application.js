const databaseImported = false

if (databaseImported) {
    const {discord} = require("./discord");
    const {homePage} = require("./homepage");
    const {isReleaseBuild} = require("./utils/dev");
    const {refresher} = require("./cron/Refresher");
    const royaleDotDB = require("./database/royale-dot-database");

    royaleDotDB.init()
    discord.initialize()
    refresher.initialize()
    if (isReleaseBuild()) {
        homePage.initialize()
    }
} else {
    console.log(`import the database`)
    console.log(`link:https://glitch.happyfox.com/kb/article/119-importing-code-from-your-computer/`)
}