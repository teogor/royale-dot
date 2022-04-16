const Response = require('../response')
const {Player} = require("../../database/model/player");
const playerRepository = require("../../database/repository/player-repository");

class PlayerAPI extends Response {
    constructor(data) {
        super(data)

        this.player = this.data

        switch (this.data.role.toUpperCase()) {
            case "LEADER":
                this.player.role = {
                    type: 4,
                    name: "leader",
                    nameUp: "Leader"
                }
                break
            case "COLEADER":
                this.player.role = {
                    type: 3,
                    name: "coleader",
                    nameUp: "Co-Leader"
                }
                break
            case "ELDER":
            case "ADMIN":
                this.player.role = {
                    type: 2,
                    name: "elder",
                    nameUp: "Elder"
                }
                break
            case "MEMBER":
                this.player.role = {
                    type: 1,
                    name: "member",
                    nameUp: "Member"
                }
                break
        }

        delete this.data

        this.player.clanTag = this.player.clan.tag
        const player = Player.fromAPIModel(this.player)
        playerRepository.insertPlayer(player)
    }
}

module.exports = PlayerAPI