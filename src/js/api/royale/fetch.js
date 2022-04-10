const {env} = require("../../env");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

async function fetchClanInfo(clanTag) {
    const reqUrl = `https://api.clashroyale.com/v1/clans/${clanTag}`
    xhr.open("GET", reqUrl, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("authorization", `Bearer ${env.ROYALE_API}`);
    xhr.send();
    await xhr.responseText;
    const result = JSON.parse(xhr.responseText);
    return result
}

module.exports = {
    fetchClanInfo
}