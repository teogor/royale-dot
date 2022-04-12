const {action} = require("./action");
const {autocomplete} = require("./autocomplete");
const {button} = require("./button");
const {filter} = require("./filter");
const {selectMenu} = require("./select-menu");

class ClanSlashCommands {

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
            name: "clan",
            description: "View and manage clan details",
            menu_options: [
                'select_participants_list_to25',
                'select_participants_list_to50'
            ],
            buttons: [
                'view_members_list',
                'view_current_river_race',
                'view_past_wars',
                'view_clan',
                'view_river_race_contribution'
            ],
            filters: [
                'sort_clan_members',
                'sort_members_list_next',
                'sort_members_list_previous'
            ],
            options: [
                {
                    name: "ranks",
                    description: "Update the color for a particular rank",
                    type: 1,
                    options: [
                        {
                            name: "rank",
                            description: "Targeted rank",
                            type: 8,
                            required: true
                        },
                        {
                            name: "color",
                            description: "Type a color in hex format (#000000) or by name",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: "members",
                    description: "Get clan members",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "Clan tag",
                            type: 3,
                            required: false,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "river-race",
                    description: "View current river race stats",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "Clan tag",
                            type: 3,
                            required: false,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "link",
                    description: "Link to a Clan",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "The clan's tag",
                            type: 3,
                            required: true
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
                    name: "info",
                    description: "Link to a Clan",
                    type: 1,
                    options: [
                        {
                            name: "tag",
                            description: "The clan's tag",
                            type: 3,
                            required: false,
                            autocomplete: true
                        }
                    ]
                }
            ],
            onAction: action,
            onAutocomplete: autocomplete,
            onButton: button,
            onFilter: filter,
            onSelectMenu: selectMenu
        }
    }

}

module.exports = {
    clanSlashCommands: new ClanSlashCommands()
}
