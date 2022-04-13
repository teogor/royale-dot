const {usersHandler} = require("../../database/handle/users-handler");
const onAutocomplete = require("./autocomplete");
const onSelectMenu = require("./select-menu");
const onCommand = require("./command");
const onSort = require("./sort");
const onButton = require("./button");
const onNavigate = require("./navigate");

const interactionHandler = (interaction, client) => {

    // const userID = interaction.user.id
    // usersHandler.connectUser(userID)

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
    return

    //
    // // Slash Command Autocomplete Handling
    // if (interaction.isAutocomplete()) {
    //     const cmd = this.client.slashCommands.find(command => command.name === interaction.commandName)
    //     if (!cmd) {
    //         return interaction.followUp({
    //             content: "An error has occurred"
    //         });
    //     }
    //
    //     try {
    //         await cmd.onAutocomplete(this.client, interaction);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    //
    // // Slash Command Handling
    // else if (interaction.isCommand()) {
    //     const cmd = this.client.slashCommands.find(command => command.name === interaction.commandName)
    //     if (!cmd) {
    //         return interaction.followUp({
    //             content: "An error has occurred",
    //             ephemeral: true
    //         });
    //     }
    //
    //     await interaction.deferReply({ephemeral: false}).catch(error => {
    //         console.error(error)
    //     });
    //
    //     try {
    //         await cmd.onAction(this.client, interaction);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    //
    // // Context Menu Handling
    // else if (interaction.isContextMenu()) {
    //     await interaction.deferReply({
    //         ephemeral: false
    //     });
    //     const command = this.client.slashCommands.get(interaction.commandName);
    //     if (command) command.run(this.client, interaction);
    // }
    //
    // // Select Menu Handling
    // else if (interaction.isSelectMenu()) {
    //     if (interaction.customId.includes("sort")) {
    //         interaction.arguments = interaction.values[0].split("-").slice(1)
    //         const cmd = this.client.slashCommands.find(command => command.filters.includes(interaction.customId))
    //         if (!cmd) {
    //             return interaction.followUp({
    //                 content: "An error has occurred"
    //             });
    //         }
    //
    //         try {
    //             await cmd.onFilter(this.client, interaction);
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     } else {
    //         await interaction.deferReply({ephemeral: true}).catch(error => {
    //             console.error(error)
    //         });
    //
    //         interaction.arguments = interaction.values[0].split("-").slice(1)
    //         const cmd = this.client.slashCommands.find(command => command.menu_options.includes(interaction.customId))
    //         if (!cmd) {
    //             return interaction.followUp({
    //                 content: "An error has occurred"
    //             });
    //         }
    //
    //         try {
    //             await cmd.onSelectMenu(this.client, interaction);
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    // }
    //
    // // Button Handling
    // else if (interaction.isButton()) {
    //     if (interaction.customId.includes("sort")) {
    //         const components = interaction.customId.split(" ")
    //         interaction.customId = components[0]
    //         interaction.arguments = components[1].split("-").slice(1)
    //         const cmd = this.client.slashCommands.find(command => command.filters.includes(interaction.customId))
    //         if (!cmd) {
    //             return interaction.followUp({
    //                 content: "An error has occurred"
    //             });
    //         }
    //
    //         try {
    //             await cmd.onFilter(this.client, interaction);
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     } else {
    //         await interaction.deferReply({ephemeral: true}).catch(error => {
    //             console.error(error)
    //         });
    //
    //         const components = interaction.customId.split(" ")
    //         interaction.customId = components[0]
    //         interaction.arguments = components[1].split("-").slice(1)
    //         const cmd = this.client.slashCommands.find(command => command.buttons.includes(interaction.customId))
    //         if (!cmd) {
    //             return interaction.followUp({
    //                 content: "An error has occurred"
    //             });
    //         }
    //
    //         try {
    //             await cmd.onButton(this.client, interaction);
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    // }
}

module.exports = interactionHandler