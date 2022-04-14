const {PlayersRepository} = require("../repository/players-repository");
const {AppDAO} = require("../dao");
const {guildsHandler} = require("./guilds-handler");
const discordClient = require("../../discord/client");

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
        this.getPlayerByTag(player.tag).then(oldData => {
            this.playersRepository.updateClanMember(
                player.name,
                player.role.type,
                player.expLevel,
                player.trophies,
                player.clanRank,
                player.donations,
                player.donationsReceived,
                player.tag
            )
            if (player.role.type !== oldData.role) {
                switch (oldData.role) {
                    case 4:
                        oldData.role = {
                            type: 4,
                            name: "leader",
                            nameUp: "Leader"
                        }
                        break
                    case 3:
                        oldData.role = {
                            type: 3,
                            name: "coleader",
                            nameUp: "Co-Leader"
                        }
                        break
                    case 2:
                        oldData.role = {
                            type: 2,
                            name: "elder",
                            nameUp: "Elder"
                        }
                        break
                    case 1:
                        oldData.role = {
                            type: 1,
                            name: "member",
                            nameUp: "Member"
                        }
                        break
                }
                const changes = {
                    role: {
                        oldValue: oldData.role,
                        newValue: player.role
                    }
                }
                const clan = player.clan
                delete player.clan
                guildsHandler.getClanUpdateChannels(clan.tag).then(channels => {
                    discordClient.emit('clash-royale', {
                        update: true,
                        type: 'rank-update',
                        elements: changes,
                        clan,
                        channels,
                        member: player,
                    });
                })
            }
        })
    }

    connectPlayer(player) {
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
        if (player.joined) {
            this.handlePlayerJoin(player)
        } else if (player.left) {
            this.handlePlayerLeft(player)
        }
    }

    handlePlayerJoin(player) {
        this.addToClan(player)
        guildsHandler.getClanUpdateChannels(player.clan.tag).then(channels => {
            discordClient.emit('clash-royale', {
                update: true,
                type: 'player-joined',
                clan: player.clan,
                channels,
                member: player,
            });
        })
    }

    addToClan(player) {
        this.playersRepository.addToClan(
            player.tag,
            player.clan.tag
        )
    }

    handlePlayerLeft(player) {
        this.removeFromClan(player)
        guildsHandler.getClanUpdateChannels(player.clan.tag).then(channels => {
            discordClient.emit('clash-royale', {
                update: true,
                type: 'player-left',
                clan: player.clan,
                channels,
                member: player,
            });
        })
    }

    removeFromClan(player) {
        this.playersRepository.removeFromClan(
            player.tag
        )
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