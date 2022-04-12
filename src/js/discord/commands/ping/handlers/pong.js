const {Badges} = require("../../../../../res/values/badges");

async function actionPong(client, interaction) {
    await interaction.followUp({
        content: `:ping_pong:  Pong! (**${interaction.client.ws.ping}ms**) ${Badges.Coin_01} ${Badges.Bolt_03}`
    })
}

module.exports = {
    actionPong
}