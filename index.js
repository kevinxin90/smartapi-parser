const loadJsonFile = require('load-json-file');
var sha256 = require('hash-anything').sha256;

class API {
    constructor(smartapiSpecPath) {
        this.smartapiSpecPath = smartapiSpecPath;
        this.smartapiDoc = {};
    }
    /**
     * Update the primary ID from id options
     * @returns - an id_dict updated with primary id choices
     */
    loadSmartAPI = async () => {
        try {
            this.smartapiDoc = await loadJsonFile(this.smartapiSpecPath);
        } catch (err) {
            throw new Error("Unable to load your input file");
        }
    }

    fetchAPIName = () => {
        if (this.smartapiDoc === {}) {
            return undefined
        }
        if (!('info' in this.smartapiDoc)) {
            return undefined
        }
        return this.smartapiDoc['info']['title']
    }

    fetchAPITags = () => {
        if (this.smartapiDoc === {}) {
            return []
        }
        if (!('tags' in this.smartapiDoc)) {
            return []
        }
        return this.smartapiDoc['tags'].map(x => x['name'])
    }

    fetchServerUrl = () => {
        if (this.smartapiDoc === {}) {
            return undefined
        }
        if (!('servers' in this.smartapiDoc)) {
            return undefined
        }
        return this.smartapiDoc['servers'][0]['url']
    }

    fetchAPIMeta = () => {
        return {
            name: this.fetchAPIName(),
            tags: this.fetchAPITags(),
            url: this.fetchServerUrl(),
            response_mapping: this.smartapiDoc["components"]["x-bte-response-mapping"],
            kgs_operations: this.smartapiDoc["components"]["x-bte-kgs-operations"]
        }
    }

    fetchAllOpts = () => {
        let res = [];
        const api_meta = this.fetchAPIMeta();
        for (let path of Object.keys(this.smartapiDoc["paths"])) {
            let ep = new Endpoint(this.smartapiDoc['paths'][path], api_meta, path);
            res = [...res, ...ep.constructEndpointInfo()];
        }
        return res;
    }

}

class Endpoint {
    constructor(endpointDoc, API, path) {
        this.endpointDoc = endpointDoc;
        this.API = API;
        this.path = path;
    }

    fetchResponseMapping = (ref) => {
        const path = ref.split('/');
        return this.API["response_mapping"][path[path.length - 1]];
    }

    fetchSingleXBteKgsOperation = (ref) => {
        const path = ref.split('/');
        return this.API["kgs_operations"][path[path.length - 1]];
    }

    static fetchPathParams = (methodDoc) => {
        let params = [];
        if (!('parameters' in methodDoc)) {
            return params
        }
        for (let param of methodDoc['parameters']) {
            if (param['in'] === 'path') {
                params.push(param['name'])
            }
        }
        return params;
    }

    parseIndividualOperation = (op, method, path_params) => {
        let res = [];
        const server = this.API.url;
        const api_name = this.API.name;
        for (let input of op['inputs']) {
            for (let output of op['outputs']) {
                let updateInfo = {
                    query_operation: {
                        'params': op['parameters'],
                        'request_body': op['requestBody'],
                        'path': this.path,
                        'path_params': path_params,
                        'method': method,
                        'server': server,
                        'api_name': api_name,
                        'tags': this.API.tags
                    },
                    association: {
                        'input_id': input['id'],
                        'input_type': input['semantic'],
                        'output_id': output['id'],
                        'output_type': output['semantic'],
                        'predicate': op['predicate']
                    },
                    response_mapping: {
                        [op['predicate']]: this.fetchResponseMapping(op['response_mapping']['$ref'])
                    }
                }
                updateInfo['id'] = sha256(op['query_operation']);
                res.push(updateInfo)
            }
        }
        return res;
    }

    constructEndpointInfo = () => {
        let res = [];
        for (let method of Object.keys(this.endpointDoc)) {
            let path_params = this.constructor.fetchPathParams(this.endpointDoc[method]);
            if ("x-bte-kgs-operations" in this.endpointDoc[method]) {
                let operation;
                let op;
                let tmp;
                for (let ref of this.endpointDoc[method]["x-bte-kgs-operations"]) {
                    operation = this.fetchSingleXBteKgsOperation(ref["$ref"]);
                    for (op of operation) {
                        res = [...res, ...this.parseIndividualOperation(op, method, path_params)];
                    }
                }
            }
        }
        return res;
    }
}
exports.API = API;
exports.Endpoint = Endpoint;