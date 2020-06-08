const sha256 = require('hash-anything').sha256;


module.exports = class Endpoint {
    constructor(endpointDoc, API, path) {
        this.endpointDoc = endpointDoc;
        this.API = API;
        this.path = path;
    }

    static fetchPathParams(methodDoc) {
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

    parseIndividualOperation(op, method, path_params) {
        let res = [];
        const server = this.API.url;
        const api_name = this.API.title;
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
                        'tags': this.API.tags,
                        'supportBatch': op.supportBatch,
                        'inputSeparator': op.inputSeparator
                    },
                    association: {
                        'input_id': input['id'],
                        'input_type': input['semantic'],
                        'output_id': output['id'],
                        'output_type': output['semantic'],
                        'predicate': op['predicate'],
                        'source': op.source,
                        'api_name': api_name,
                        'smartapi': this.API.smartapi
                    },
                    response_mapping: {
                        [op['predicate']]: {}
                    }
                }
                if ('$ref' in op.response_mapping) {
                    updateInfo['response_mapping'][op['predicate']] = this.API.components.fetchComponentByRef(op.response_mapping["$ref"]);
                } else {
                    updateInfo['response_mapping'][op['predicate']] = op.response_mapping;
                }
                updateInfo['id'] = sha256(op['query_operation']);
                res.push(updateInfo)
            }
        }
        return res;
    }

    constructEndpointInfo() {
        let res = [];
        for (let method of Object.keys(this.endpointDoc)) {
            let path_params = this.constructor.fetchPathParams(this.endpointDoc[method]);
            if ("x-bte-kgs-operations" in this.endpointDoc[method]) {
                let operation, op;
                for (let rec of this.endpointDoc[method]["x-bte-kgs-operations"]) {
                    if ("$ref" in rec) {
                        operation = this.API.components.fetchComponentByRef(rec["$ref"]);
                    } else {
                        operation = rec
                    }
                    for (op of operation) {
                        res = [...res, ...this.parseIndividualOperation(op, method, path_params)];
                    }
                }
            }
        }
        return res;
    }
}

