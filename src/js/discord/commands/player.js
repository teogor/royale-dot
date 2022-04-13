const updateClanRankColor = {
    name: "rank-color",
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
}

const getClanMembers = {
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
}

const getClanInfo = {
    name: "info",
    description: "Get clan info",
    type: 1,
    options: [
        {
            name: "tag",
            description: "Type the clan's tag",
            type: 3,
            required: false,
            autocomplete: true
        }
    ]
}

const getClanRiverRace = {
    name: "river-race",
    description: "Get the clan's River Race",
    type: 1,
    options: [
        {
            name: "tag",
            description: "Type the clan's tag",
            type: 3,
            required: false,
            autocomplete: true
        }
    ]
}

const getClanRiverRaceParticipants = {
    name: "river-race-participants",
    description: "Get the clan's participants in the River Race",
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
}

const linkPlayer = {
    name: "link",
    description: "Link to a player",
    type: 1,
    options: [
        {
            name: "tag",
            description: "The player's tag that you want to link to",
            type: 3,
            required: true
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

const playerSlashCommands = {
    name: "player",
    description: "View and manage player details",
    options: [
        linkPlayer,
        unlinkPlayer
    ]
}

module.exports = {
    playerSlashCommands
}