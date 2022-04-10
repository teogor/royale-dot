const {actionPong} = require("./handlers/pong");

const action = async (client, interaction) => {
    await actionPong(client, interaction)
}

module.exports = {
    action
}