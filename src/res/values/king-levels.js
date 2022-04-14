const KingLevels = {
    kinglvl_1: '<:kinglvl_1:964084946002120735>',
    kinglvl_2: '<:kinglvl_2:964085428724584448>',
    kinglvl_3: '<:kinglvl_3:964088206628880445>',
    kinglvl_4: '<:kinglvl_4:964088206440140851>',
    kinglvl_5: '<:kinglvl_5:964087925346291722>',
    kinglvl_6: '<:kinglvl_6:964087924977205270>',
    kinglvl_7: '<:kinglvl_7:964088206603714560>',
    kinglvl_8: '<:kinglvl_8:964088206595346472>',
    kinglvl_9: '<:kinglvl_9:964087925241446421>',
    kinglvl_10: '<:kinglvl_10:964085808426520578>',
    kinglvl_11: '<:kinglvl_11:964086568111448124>',
    kinglvl_12: '<:kinglvl_12:964086567872368650>',
    kinglvl_13: '<:kinglvl_13:964086567989813289>',
    kinglvl_14: '<:kinglvl_14:964086567805272104>',
    kinglvl_15: '<:kinglvl_15:964086568019181598>',
    kinglvl_16: '<:kinglvl_16:964086568254070804>',
}

const getKingLevel = (kingLevel) => {
    const kingLevelEmoji = KingLevels[Object.keys(KingLevels)[kingLevel - 1]]
    if (kingLevelEmoji !== undefined) {
        return kingLevelEmoji
    }
    return KingLevels.kinglvl_1
}

module.exports = {
    KingLevels,
    getKingLevel
}
