const {PlayersRepository} = require("../repository/players-repository");
const {AppDAO} = require("../dao");

class PlayersHandler {

    //#region VARIABLES
    get playersRepository() {
        return this._playersRepository;
    }

    set playersRepository(value) {
        this._playersRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.playersRepository = new PlayersRepository(AppDAO)
    }

    async exists(tag) {
        const data = await this.playersRepository.exists(tag)
        return data !== undefined
    }

    connectNewPlayer(player) {
        this.playersRepository.connectPlayer(
            player.tag,
            player.name,
            player.clanTag,
            player.expLevel,
            player.trophies,
            player.bestTrophies,
            player.wins,
            player.losses,
            player.battleCount,
            player.threeCrownWins,
            player.challengeCardsWon,
            player.challengeMaxWins,
            player.tournamentCardsWon,
            player.tournamentBattleCount,
            player.role.type,
            player.donations,
            player.donationsReceived,
            player.totalDonations,
            player.warDayWins,
            player.clanCardsCollected,
            player.starPoints,
            player.expPoints,
            player.clanRank,
        )
    }

    reconnectPlayer(player) {
        player.role = player.role.type
        // const tag = clan.tag
        // const newData = clan
        // newData.location_name = newData.locationName
        // newData.location_is_country = newData.locationIsCountry ? 1 : 0
        // delete newData.location
        // delete newData.clanChestMaxLevel
        // delete newData.clanChestLevel
        // delete newData.clanChestStatus
        // delete newData.memberList
        // delete newData.tag
        this.getPlayerByTag(player.tag).then(oldData => {
            this.playersRepository.updateClanMember(
                player.name,
                player.role,
                player.expLevel,
                player.trophies,
                player.clanRank,
                player.donations,
                player.donationsReceived,
                player.tag
            )
        })
    }

    connectPlayer(
        player
    ) {
        const tag = player.tag
        this.exists(tag).then(exists => {
            if (!exists) {
                player.tag = tag
                this.connectNewPlayer(player)
            } else {
                player.tag = tag
                this.reconnectPlayer(player)
            }
        })
    }

    async getPlayer(playerID) {
        return this.playersRepository.getPlayer(playerID)
    }

    async getPlayerByTag(tag) {
        return this.playersRepository.getPlayerByTag(tag)
    }

    async getForClan(clanTag, pattern) {
        pattern = `%${pattern.replace(/\s/g, '').split("").join("%")}%`
        return await this.playersRepository.getForClan(clanTag, pattern)
    }
}

module.exports = {
    playersHandler: new PlayersHandler()
}