const Response = require('../response')
const {maxKingLevel} = require("./utils");

class Cards extends Response {

    constructor(data) {
        super(data)

        this.items = this.data
        delete this.data
        this.rarities = {
            CHAMPION: {
                startLevel: 11,
                maxLevel: maxKingLevel - 10
            },
            LEGENDARY: {
                startLevel: 9,
                maxLevel: maxKingLevel - 8
            },
            EPIC: {
                startLevel: 6,
                maxLevel: maxKingLevel - 5
            },
            RARE: {
                startLevel: 3,
                maxLevel: maxKingLevel - 2
            },
            COMMON: {
                startLevel: 1,
                maxLevel: maxKingLevel
            }
        }
    }

    filter(rarity) {
        return this.items.filter(card => card.maxLevel === rarity.maxLevel)
    }

    get commons() {
        return this.filter(this.rarities.COMMON)
    }

    get rares() {
        return this.filter(this.rarities.RARE)
    }

    get epics() {
        return this.filter(this.rarities.EPIC)
    }

    get legendaries() {
        return this.filter(this.rarities.LEGENDARY)
    }

    get champions() {
        return this.filter(this.rarities.LEGENDARY)
    }
}

module.exports = Cards