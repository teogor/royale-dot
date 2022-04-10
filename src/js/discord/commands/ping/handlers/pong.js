async function actionPong(client, interaction) {
    await interaction.followUp({
        content: `:ping_pong:  Pong! (**${interaction.client.ws.ping}ms**)`
    })
}

module.exports = {
    actionPong
}