const guildRepository = require("../repository/guild-repository");
const {Guild} = require("../model/guild");
const {ColorsValues} = require("../../../res/values/colors");
const clanRepository = require("../repository/clan-repository");
const deepDiffMapper = require("../../utils/diff");
const discordClient = require("../../discord/client");

function getClanType(type) {
    switch (type) {
        case 0:
            return 'open'
        case 1:
            return 'invite only'
        case 2:
            return 'closed'
    }
}

function onCheckClan(clan) {
    const tag = clan.tag
    clanRepository.getClan(tag).then(clanOld => {
        clanRepository.insertClan(clan)
        const diffs = deepDiffMapper.map(clanOld, clan)
        if (diffs.type !== undefined) {
            diffs.type.newValue = getClanType(diffs.type.newValue)
            diffs.type.oldValue = getClanType(diffs.type.oldValue)
        }
        guildRepository.getClanNewsChannelsByTag(tag).then(newsChannels => {
            discordClient.emit('clash-royale', {
                update: true,
                type: 'clan-update',
                clan: {
                    tag,
                    badgeId: clan.badgeId,
                    name: clan.name
                },
                channels: newsChannels,
                elements: diffs
            });
        })
    })
}

module.exports = {
    onCheckClan,
}