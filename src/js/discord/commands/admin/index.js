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
            name: "admin",
            description: "-- players --",
            menu_options: [],
            buttons: [],
            filters: [],
            options: [
                {
                    name: "set-clan-updates-channel",
                    description: "Link your CR account",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "CR account tag from profile",
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
