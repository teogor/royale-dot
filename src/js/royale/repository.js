const {MessageEmbed} = require("discord.js");
const {ColorsValues} = require("../../res/values/colors");
const {linkedClansHandler} = require("../database/handle/linked-clans-handler");
const {royaleDAO} = require("./dao");
const {linkedAccountsHandler} = require("../database/handle/linked-accounts-handler");
const {Emojis} = require("../../res/values/emojis");

class RoyaleRepository {

    async getClan(tag, guildID) {
        const tagData = await this.getTag(tag, guildID)

        if (tagData.error) {
            return tagData
        }

        const clan = await royaleDAO.getClan(tagData.tag)

        return {
            clan
        }
    }

    async getClanRiverRace(tag, guildID) {
        const tagData = await this.getTag(tag, guildID)

        if (tagData.error) {
            return tagData
        }

        const clanRiverRace = await royaleDAO.getClanRiverRace(tagData.tag)

        return {
            clanRiverRace,
            tag: tagData.tag
        }
    }

    async getClanMembers(tag, guildID) {
        const tagData = await this.getTag(tag, guildID)

        if (tagData.error) {
            return tagData
        }

        const members = await royaleDAO.getClanMembers(tagData.tag)

        return {
            members,
            tag: tagData.tag
        }
    }

    async getTag(tag, guildID) {
        if (!this.isValidString(tag)) {
            const guildLinked = await linkedClansHandler.isLinked(guildID)
            if (guildLinked.isGuildLinked) {
                tag = guildLinked.tag
            } else {
                return {
                    error: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor(ColorsValues.colorBotRed)
                            .setDescription(`No tag was provided and no clan was linked to this server`)
                    ],
                    ephemeral: true
                }
            }
        }
        return this.parseTag(tag)
    }

    async getPlayerTag(tag, providedUserID, userID) {
        if (tag !== null ){
            return this.parseTag(tag)
        } else if (providedUserID !== null) {
            const linkedPlayer = await linkedAccountsHandler.isLinked(providedUserID)
            if (!linkedPlayer.isLinked) {
                return {
                    error: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor(ColorsValues.colorBotRed)
                            .setDescription(`${Emojis.Close} No CR accounts linked to this profile`)
                    ],
                    ephemeral: true
                }
            }
            return {
                tag: linkedPlayer.linkedTag
            }
        } else {
            const linkedPlayer = await linkedAccountsHandler.isLinked(userID)
            if (!linkedPlayer.isLinked) {
                return {
                    error: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor(ColorsValues.colorBotRed)
                            .setDescription(`${Emojis.Close} No CR accounts linked to this profile`)
                    ],
                    ephemeral: true
                }
            }
            return {
                tag: linkedPlayer.linkedTag
            }
        }
    }

    async getPlayer(tag) {
        return await royaleDAO.getPlayer(tag)
    }

    parseTag(tag) {
        // remove all whitespaces
        tag = tag.replace(/\s/g, '')

        if (!this.isValidTag(tag)) {
            return {
                error: true,
                embeds: [
                    new MessageEmbed()
                        .setColor(ColorsValues.colorBotRed)
                        .setDescription(
                            `An invalid tag was provided!\n` +
                            `These are the valid characters for a tag: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V`
                        )
                ],
                ephemeral: true,
                tag
            }
        }
        if (tag[0] !== '#') {
            tag = `#${tag}`
        }
        return {
            error: false,
            tag
        }
    }

    // todo utils methods
    isValidString = (string) => {
        return string !== undefined && string !== null
    }

    isValidTag = (tag) => {
        return /^([0289PYLQGRJCUV])+$/.test(tag) || /^#([0289PYLQGRJCUV])+$/.test(tag)
    }

}

module.exports = {
    royaleRepository: new RoyaleRepository()
}