const {env} = require("../env");
const axios = require('axios')
const queryString = require("querystring");
const discordClient = require("../discord/client");

class Requester {
    async get(route, query) {
        try {

            axios.defaults.headers = {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            };
            const request = {
                method: 'get',
                url: `${route}?${query ? queryString.stringify(query) : ''}`,
                baseURL: 'https://api.clashroyale.com/v1/',
                headers: {
                    Accept: 'application/json',
                    authorization: `Bearer ${env.ROYALE_API}`
                }
            }
            const response = await axios(request)
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = {
    requester: new Requester()
}