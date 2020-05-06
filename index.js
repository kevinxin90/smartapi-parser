const loadJsonFile = require('load-json-file');


class API {
    constructor(smartapiSpecPath) {
        this.smartapiSpecPath = smartapiSpecPath;
        this.smartapiDoc = {};
    }

    loadSmartAPI = async () => {
        try {
            this.smartapiDoc = await loadJsonFile(this.smartapiSpecPath);
        } catch(err) {
            console.log(err);
        }
    }
}
exports.API = API;