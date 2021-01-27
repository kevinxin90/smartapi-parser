const sha256 = require('hash-anything').sha256;

import {
    SmartAPIPathItemObject,
    ParsedAPIMetadataObject,
    SmartAPIKGOperationObject,
    SmartAPIOperationObject,
    XBTEKGSOperationObject,
} from './common/types';

export = class Endpoint {
    pathItemObject: SmartAPIPathItemObject;
    apiMetadata: ParsedAPIMetadataObject;
    path: string;

    constructor(pathItemObject: SmartAPIPathItemObject, apiMetadata: ParsedAPIMetadataObject, path: string) {
        this.pathItemObject = pathItemObject;
        this.apiMetadata = apiMetadata;
        this.path = path;
    }

    private fetchPathParams(OperationObject: SmartAPIOperationObject): string[] {
        const params: string[] = [];
        if (!('parameters' in OperationObject)) {
            return params;
        }
        for (const param of OperationObject.parameters) {
            if (param.in === 'path') {
                params.push(param.name);
            }
        }
        return params;
    }

    private parseIndividualOperation({
        op,
        method,
        pathParams,
    }: {
        op: XBTEKGSOperationObject;
        method: string;
        pathParams: string[];
    }) {
        const res = [];
        const server = this.apiMetadata.url;
        const apiName = this.apiMetadata.title;
        for (const input of op.inputs) {
            for (const output of op.outputs) {
                let updateInfo = {} as SmartAPIKGOperationObject;
                updateInfo = {
                    query_operation: {
                        params: op.parameters,
                        request_body: op.requestBody,
                        path: this.path,
                        path_params: pathParams,
                        method,
                        server,
                        tags: this.apiMetadata.tags,
                        supportBatch: op.supportBatch,
                        inputSeparator: op.inputSeparator,
                    },
                    association: {
                        input_id: input.id,
                        input_type: input.semantic,
                        output_id: output.id,
                        output_type: output.semantic,
                        predicate: op.predicate,
                        source: op.source,
                        api_name: apiName,
                        smartapi: this.apiMetadata.smartapi,
                        'x-translator': this.apiMetadata['x-translator'],
                    },
                    response_mapping: {
                        [op.predicate]: {},
                    },
                };
                if ('$ref' in op.response_mapping) {
                    updateInfo.response_mapping[op.predicate] = this.apiMetadata.components.fetchComponentByRef(
                        op.response_mapping.$ref,
                    );
                } else {
                    updateInfo.response_mapping[op.predicate] = op.response_mapping;
                }
                updateInfo.id = sha256(updateInfo.query_operation);
                res.push(updateInfo);
            }
        }
        return res;
    }

    constructEndpointInfo() {
        let res = [] as SmartAPIKGOperationObject[];
        enum AcceptedMethod {
            'get',
            'post',
        }
        ['get', 'post'].map((method) => {
            if (method in this.pathItemObject) {
                const pathParams = this.fetchPathParams(this.pathItemObject[method]);
                if ('x-bte-kgs-operations' in this.pathItemObject[method]) {
                    let operation;
                    let op;
                    for (const rec of this.pathItemObject[method]['x-bte-kgs-operations']) {
                        if ('$ref' in rec) {
                            operation = this.apiMetadata.components.fetchComponentByRef(rec.$ref);
                        } else {
                            operation = rec;
                        }
                        if (!(Array.isArray(operation))) {
                            operation = [operation];
                        }
                        for (op of operation) {
                            res = [...res, ...this.parseIndividualOperation({ op, method, pathParams })];
                        }
                    }
                }
            }
        });
        return res;
    }
};
