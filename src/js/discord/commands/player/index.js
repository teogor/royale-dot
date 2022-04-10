const {action} = require("./action");
const {autocomplete} = require("./autocomplete");
const {selectMenu} = require("./select-menu");

class PlayerSlashCommands {

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
            name: "player",
            description: "-- players --",
            menu_options: [
                'select_member_to_25', 'select_member_to_50'
            ],
            buttons: [],
            filters: [],
            options: [
                {
                    name: "link",
                    description: "Link your CR account",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "CR account tag from profile",
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "info",
                    description: "View details about a user",
                    type: 1,
                    options: [
                        {
                            name: "user",
                            description: "The targeted player",
                            type: 6,
                            required: false
                        },
                        {
                            name: "tag",
                            description: "The targeted player",
                            type: 3,
                            required: false,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "stats",
                    description: "View stats for a player",
                    type: 1,
                    options: [
                        {
                            name: "user",
                            description: "The targeted player",
                            type: 6,
                            required: false
                        }
                    ]
                }
            ],
            onAction: action,
            onAutocomplete: autocomplete,
            onSelectMenu: selectMenu
        }
    }

}

module.exports = {
    playerSlashCommands: new PlayerSlashCommands()
}
