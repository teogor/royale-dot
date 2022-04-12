const {action} = require("./action");
const {autocomplete} = require("./autocomplete");
const {selectMenu} = require("./select-menu");
const {button} = require("./button");

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
            buttons: [
                'view_profile_overview',
                'view_player'
            ],
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
                    name: "unlink",
                    description: "Unlink a Clan",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "The clan's tag",
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "overview",
                    description: "View the overview for a player",
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
                    name: "profile",
                    description: "View the full clash royale profile for a player",
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
                    name: "river-race-contribution",
                    description: "View the contribution in the river race for a player",
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
            onSelectMenu: selectMenu,
            onButton: button
        }
    }

}

module.exports = {
    playerSlashCommands: new PlayerSlashCommands()
}
