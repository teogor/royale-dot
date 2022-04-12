const {action} = require("./action");

class AdminSlashCommands {

    //#region VARIABLES
    get slashCommand() {
        return this._slashCommand;
    }

    set slashCommand(value) {
        this._slashCommand = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.prepareCommand()
    }

    prepareCommand() {
        this.slashCommand = {
            name: "updates",
            description: "-- players --",
            menu_options: [],
            buttons: [],
            filters: [],
            options: [
                {
                    name: "set-clan-channel",
                    description: "Choose the channel where to receive the clan updates",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "Targeted Channel",
                            type: 7,
                            required: true,
                        }
                    ]
                },
                {
                    name: "set-river-race-channel",
                    description: "Choose the channel where to receive the river-race updates",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "Targeted Channel",
                            type: 7,
                            required: true,
                        }
                    ]
                },
            ],
            onAction: action,
        }
    }

}

module.exports = {
    adminSlashCommands: new AdminSlashCommands()
}
