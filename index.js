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
            throw new Error("Unable to load your input file");
        }
    }
}
exports.API = API;