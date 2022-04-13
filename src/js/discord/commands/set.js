const clanNewsChannel = {
    name: "clan-news",
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

const riverRaceNewsChannel = {
    name: "river-race-news",
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

const setSlashCommands = {
    name: "set",
    description: "Sets some channels",
    options: [
        clanNewsChannel,
        riverRaceNewsChannel
    ]
}

module.exports = {
    setSlashCommands
}