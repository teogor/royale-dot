const isDevBuild =  function isDevBuild() {
    return process.argv[2] === "dev"
}

module.exports = {
    isDevBuild
}