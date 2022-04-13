function sendFollowUp(interaction, response) {
    interaction.followUp({
        ...response
    }).catch(_ => {
        interaction.deferReply({...response}).catch(_ => {
            sendFollowUp(interaction, response)
        })
    })
}

function sendButtonResponse(interaction, response) {
    response.ephemeral = true
    interaction.followUp({
        ...response
    }).catch(_ => {
        interaction.deferReply({...response}).catch(_ => {
            console.log(_)
            sendFollowUp(interaction, response)
        })
    })
}

function sendUpdate(interaction, response) {
    interaction.update({
        ...response
    }).catch(error => {
        console.error(error)
    })
}

module.exports = {
    sendFollowUp,
    sendButtonResponse,
    sendUpdate
}