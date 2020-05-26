const component = require("./component");
const endpoint = require("./endpoint");

module.exports = class API {
    /**
     * constructor to load SmartAPI specification.
     * @param {object} smartapiDoc - SmartAPI Specification in Javascript Object format
     */
    constructor(smartapiDoc) {
        this.smartapiDoc = smartapiDoc;
    }

    /**
     * Fetch the title of API from SmartAPI Specification.
    */
    fetchAPITitle = () => {
        if (!('info' in this.smartapiDoc)) {
            return undefined
        }
        return this.smartapiDoc['info']['title']
    }

    /**
     * Fetch the tags associated with the API from SmartAPI Specification.
     */
    fetchAPITags = () => {
        if (!('tags' in this.smartapiDoc)) {
            return undefined
        }
        return this.smartapiDoc['tags'].map(x => x['name'])
    }

    /**
     * Fetch the url of the server from SmartAPI Specification.
     */
    fetchServerUrl = () => {
        if (!('servers' in this.smartapiDoc)) {
            return undefined
        }
        return this.smartapiDoc['servers'][0]['url']
    }

    /**
     * Fetch component from SmartAPI Specification.
     */
    fetchComponents = () => {
        if (!('components' in this.smartapiDoc)) {
            return undefined
        }
        return new component(this.smartapiDoc.components)
    }

    /**
     * Fetch metadata information from SmartAPI Specification.
     */
    fetchAPIMeta = () => {
        return {
            title: this.fetchAPITitle(),
            tags: this.fetchAPITags(),
            url: this.fetchServerUrl(),
            components: this.fetchComponents()
        }
    }

    /**
     * Fetch all operations from SmartAPI Specification.
     */
    fetchAllOpts = () => {
        let res = [];
        const api_meta = this.fetchAPIMeta();
        for (let path of Object.keys(this.smartapiDoc["paths"])) {
            let ep = new endpoint(this.smartapiDoc['paths'][path], api_meta, path);
            res = [...res, ...ep.constructEndpointInfo()];
        }
        return res;
    }

}
