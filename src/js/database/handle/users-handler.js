const {AppDAO} = require("../dao");
const {UsersRepository} = require("../repository/users-repository");

class PlayersHandler {

    //#region VARIABLES
    get usersRepository() {
        return this._usersRepository;
    }

    set usersRepository(value) {
        this._usersRepository = value;
    }

    //#endregion VARIABLES

    constructor() {
        this.usersRepository = new UsersRepository(AppDAO)
    }

    connectUser(
        playerID,
    ) {
        return this.usersRepository.connectUser(playerID)
    }
}

module.exports = {
    playersHandler: new PlayersHandler()
}