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

    addPlayer(
        userId,
        result,
        tag,
        role
    ) {
        this.playersRepository.addPlayer(
            userId,
            tag,
            result.clan.tag.replaceAll("#", ""),
            result.name,
            result.expLevel,
            result.trophies,
            result.bestTrophies,
            result.wins,
            result.losses,
            result.battleCount,
            result.threeCrownWins,
            result.challengeCardsWon,
            result.challengeMaxWins,
            result.tournamentCardsWon,
            result.tournamentBattleCount,
            role,
            result.donations,
            result.donationsReceived,
            result.totalDonations,
            result.warDayWins,
            result.clanCardsCollected,
            result.starPoints,
            result.expPoints
        )
    }

    async getPlayer(playerID) {
        return this.playersRepository.getPlayer(playerID)
    }
}

module.exports = {
    playersHandler: new PlayersHandler()
}