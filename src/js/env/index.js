require('dotenv').config()

const env = {
    APP_ID: process.env.APP_ID,
    TOKEN: process.env.TOKEN,
    ROYALE_API: process.env.ROYALE_API
}

module.exports = {
    env
}

