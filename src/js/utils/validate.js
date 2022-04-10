const isValidTag = (tag) => {
    return /^#([0289PYLQGRJCUV])+$/.test(tag)
}

module.exports = {
    isValidTag
}