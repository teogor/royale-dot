const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../../res/values/colors");
const {usersHandler} = require("../../database/handle/users-handler");

class OnInteractionCreate {

    //#region VARIABLES
    get client() {
        return this._client;
    }

    set client(value) {
        this._client = value;
    }

    get commands() {
        return this._commands;
    }

    set commands(value) {
        this._commands = value;
    }

    //#endregion VARIABLES

    static bind(client) {
        const onInteractionCreate = new OnInteractionCreate(client)
        onInteractionCreate.listen()
    }

    constructor(client) {
        this.client = client
    }

    listen() {
        this.client.on("interactionCreate", async (interaction) => {
            return this.client.onInteractionCreated(interaction, this.client)

            const userID = interaction.user.id
            usersHandler.connectUser(userID)

            // Slash Command Autocomplete Handling
            if (interaction.isAutocomplete()) {
                const cmd = this.client.slashCommands.find(command => command.name === interaction.commandName)
                if (!cmd) {
                    return interaction.followUp({
                        content: "An error has occurred"
                    });
                }

                try {
                    await cmd.onAutocomplete(this.client, interaction);
                } catch (e) {
                    console.log(e)
                }
            }

            // Slash Command Handling
            else if (interaction.isCommand()) {
                const cmd = this.client.slashCommands.find(command => command.name === interaction.commandName)
                if (!cmd) {
                    return interaction.followUp({
                        content: "An error has occurred",
                        ephemeral: true
                    });
                }

                await interaction.deferReply({ephemeral: false}).catch(error => {
                    console.error(error)
                });

                try {
                    await cmd.onAction(this.client, interaction);
                } catch (e) {
                    console.log(e)
                }
            }

            // Context Menu Handling
            else if (interaction.isContextMenu()) {
                await interaction.deferReply({
                    ephemeral: false
                });
                const command = this.client.slashCommands.get(interaction.commandName);
                if (command) command.run(this.client, interaction);
            }

            // Select Menu Handling
            else if (interaction.isSelectMenu()) {
                if (interaction.customId.includes("sort")) {
                    interaction.arguments = interaction.values[0].split("-").slice(1)
                    const cmd = this.client.slashCommands.find(command => command.filters.includes(interaction.customId))
                    if (!cmd) {
                        return interaction.followUp({
                            content: "An error has occurred"
                        });
                    }

                    try {
                        await cmd.onFilter(this.client, interaction);
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    await interaction.deferReply({ephemeral: true}).catch(error => {
                        console.error(error)
                    });

                    interaction.arguments = interaction.values[0].split("-").slice(1)
                    const cmd = this.client.slashCommands.find(command => command.menu_options.includes(interaction.customId))
                    if (!cmd) {
                        return interaction.followUp({
                            content: "An error has occurred"
                        });
                    }

                    try {
                        await cmd.onSelectMenu(this.client, interaction);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }

            // Button Handling
            else if (interaction.isButton()) {
                if (interaction.customId.includes("sort")) {
                    const components = interaction.customId.split(" ")
                    interaction.customId = components[0]
                    interaction.arguments = components[1].split("-").slice(1)
                    const cmd = this.client.slashCommands.find(command => command.filters.includes(interaction.customId))
                    if (!cmd) {
                        return interaction.followUp({
                            content: "An error has occurred"
                        });
                    }

                    try {
                        await cmd.onFilter(this.client, interaction);
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    await interaction.deferReply({ephemeral: true}).catch(error => {
                        console.error(error)
                    });

                    const components = interaction.customId.split(" ")
                    interaction.customId = components[0]
                    interaction.arguments = components[1].split("-").slice(1)
                    const cmd = this.client.slashCommands.find(command => command.buttons.includes(interaction.customId))
                    if (!cmd) {
                        return interaction.followUp({
                            content: "An error has occurred"
                        });
                    }

                    try {
                        await cmd.onButton(this.client, interaction);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        });
    }
}

module.exports = {
    OnInteractionCreate
}