const onAutocomplete = require("./autocomplete");
const onCommand = require("./command");
const onSort = require("./sort");
const onButton = require("./button");
const onNavigate = require("./navigate");
const onSelect = require("./select");
const userRepository = require("../../database/repository/user-repository");
const {User} = require("../../database/model/user");

const interactionHandler = (interaction, client) => {

    const user = User.fromID(interaction.user.id)
    userRepository.updateCommands(user)

    if (interaction.isAutocomplete()) {
        interaction.handlerData = {
            type: "autocomplete"
        }
        onAutocomplete(interaction, client)
    } else if (interaction.isCommand()) {
        interaction.handlerData = {
            type: "command"
        }
        onCommand(interaction, client)
    } else if (interaction.isContextMenu()) {
        interaction.handlerData = {
            type: "context-menu"
        }
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId.includes("sort")) {
            interaction.handlerData = {
                type: "sort"
            }
            interaction.handlerData.arguments = interaction.values[0].split("-").slice(1)
            interaction.handlerData.isSort = true
            interaction.handlerData.action = interaction.customId
            onSort(interaction, client)
        } else if (interaction.customId.includes("select")) {
            interaction.handlerData = {
                type: "select"
            }
            interaction.handlerData.arguments = interaction.values[0].split("-").slice(1)
            interaction.handlerData.isSelect = true
            interaction.handlerData.action = interaction.customId
            onSelect(interaction, client)
        }
    } else if (interaction.isButton()) {
        if (interaction.customId.includes("navigate")) {
            interaction.handlerData = {
                type: "navigate"
            }
            onNavigate(interaction, client)
        } else if (interaction.customId.includes("button")) {
            interaction.handlerData = {
                type: "button"
            }
            onButton(interaction, client)
        }
    }
}

module.exports = interactionHandler