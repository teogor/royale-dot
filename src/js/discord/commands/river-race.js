const getInfo = {
    name: "info",
    description: "Get info for a river-race",
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

const getParticipants = {
    name: "participants",
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

const getContribution = {
    name: "contribution",
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

const setNewsChannel = {
    name: "set-news-channel",
    description: "Choose the channel where to receive news from the River Race",
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

const riverRaceSlashCommands = {
    name: "river-race",
    description: "View river-race details and relevant commands",
    options: [
        getInfo,
        getParticipants,
        getContribution,
        setNewsChannel
    ]
}

module.exports = {
    riverRaceSlashCommands
}