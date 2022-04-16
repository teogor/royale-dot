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

const linkClan = {
    name: "link",
    description: "Link to a clan",
    type: 1,
    options: [
        {
            name: "tag",
            description: "The clan's tag that you want to link to",
            type: 3,
            required: true
        }
    ]
}

const unlinkClan = {
    name: "unlink",
    description: "Unlink from the current clan",
    type: 1,
    options: [
        {
            name: "tag",
            description: "The clan's tag that you want to unlink from",
            type: 3,
            required: true,
            autocomplete: true
        }
    ]
}

const setNewsChannel = {
    name: "set-news-channel",
    description: "Choose the channel where to receive news about the clan",
    type: 1,
    options: [
        {
            name: "channel",
            description: "Targeted Channel",
            type: 7,
            required: true,
        }
    ]
}

const receiveNewsAt = {
    name: "receive-news-at",
    description: "Choose the channel where to receive news about the clan",
    type: 1,
    options: [
        {
            name: "time",
            description: "Select the time that you want to receive the news at",
            type: 3,
            required: true,
            autocomplete: true
        }
    ]
}

const cancelNewsAt = {
    name: "cancel-news-at",
    description: "Choose the channel where to receive news about the clan",
    type: 1,
    options: [
        {
            name: "time",
            description: "Select the time that you want to cancel the news at",
            type: 3,
            required: true,
            autocomplete: true
        }
    ]
}

const clanSlashCommands = {
    name: "clan",
    description: "View and manage clan details",
    options: [
        updateClanRankColor,
        getClanMembers,
        getClanInfo,
        linkClan,
        unlinkClan,
        setNewsChannel,
        receiveNewsAt,
        cancelNewsAt,
    ]
}

module.exports = {
    clanSlashCommands
}