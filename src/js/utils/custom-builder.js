function buildCustomId(id, ...args) {
    if (args.length > 0) {
        return `${id} -${args.join("-")}`
    } else {
        return `${id}`
    }
}

function buildArgs(...args) {
    return `-${args.join("-")}`
}

module.exports = {
    buildCustomId,
    buildArgs
}