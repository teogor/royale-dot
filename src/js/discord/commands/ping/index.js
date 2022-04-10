const {action} = require("./action");

class PingSlashCommands {

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
            name: "ping",
            description: "Pong!",
            menu_options: [],
            buttons: [],
            filters: [],
            onAction: action
        }
    }

}

module.exports = {
    pingSlashCommands: new PingSlashCommands()
}
