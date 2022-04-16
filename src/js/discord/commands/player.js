const linkPlayer = {
    name: "link",
    description: "Link to a player",
    type: 1,
    options: [
        {
            name: "tag",
            description: "The player's tag that you want to link to",
            type: 3,
            required: true,
            autocomplete: true
        }
    ]
}

const unlinkPlayer = {
    name: "unlink",
    description: "Unlink from the current player",
    type: 1,
    options: [
        {
            name: "tag",
            description: "The player's tag that you want to unlink from",
            type: 3,
            required: true,
            autocomplete: true
        }
    ]
}

const getPlayerOverview = {
    name: "overview",
    description: "View the overview of a player",
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
}

const getPlayerProfile = {
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
}

const getPlayerRiverRaceContribution = {
    name: "river-race-contribution",
    description: "View the contribution in the river race for a player",
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
}

const playerSlashCommands = {
    name: "player",
    description: "View and manage player details",
    options: [
        linkPlayer,
        unlinkPlayer,
        getPlayerOverview,
        getPlayerProfile
    ]
}

module.exports = {
    playerSlashCommands
}