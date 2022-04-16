function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function toLowercaseWords(string) {
    return string
        .trim()
        .split(/(?=[A-Z])/)
        .map(element => element.trim())
        .map(element => lowercaseFirstLetter(element))
        .join("_")
}

function toUppercaseWords(string) {
    return lowercaseFirstLetter(string
        .trim()
        .split("_")
        .map(element => element.trim())
        .map(element => capitalizeFirstLetter(element))
        .join(""))
}

module.exports = {
    capitalizeFirstLetter,
    lowercaseFirstLetter,
    toLowercaseWords,
    toUppercaseWords
}