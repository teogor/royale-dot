const {royaleClient} = require('./client')
class RoyaleDAO {

    async getClan(tag) {
        return await royaleClient.clan(tag)
    }

    async getClanRiverRace(tag) {
        return await royaleClient.clanRiverRace(tag)
    }

    async getClanMembers(tag) {
        return await royaleClient.clanMembers(tag)
    }

    async getPlayer(tag) {
        return await royaleClient.player(tag)
    }

}

module.exports = {
    royaleDAO: new RoyaleDAO()
}