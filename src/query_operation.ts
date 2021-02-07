import { XBTEKGSOperationObject, QueryOperationInterface, XBTEParametersObject } from './common/types';

export = class QueryOperationObject implements QueryOperationInterface {
    private _params: XBTEParametersObject;
    private _requestBody: object;
    private _supportBatch: boolean;
    private _inputSeparator: string;
    private _path: string;
    private _method: string;
    private _server: string;
    private _tags: string[];
    private _pathParams: string[];

    set xBTEKGSOperation(newOp: XBTEKGSOperationObject) {
        this._params = newOp.parameters;
        this._requestBody = newOp.requestBody;
        this._supportBatch = newOp.supportBatch;
        this._inputSeparator = newOp.inputSeparator;
    }

    get params(): XBTEParametersObject {
        return this._params;
    }

    get request_body(): object {
        return this._requestBody;
    }

    get supportBatch(): boolean {
        return this._supportBatch;
    }

    get inputSeparator(): string {
        return this._inputSeparator;
    }

    set path(newPath: string) {
        this._path = newPath;
    }

    get path(): string {
        return this._path;
    }

    get method(): string {
        return this._method;
    }

    set method(newMethod: string) {
        this._method = newMethod;
    }

    get server(): string {
        return this._server;
    }

    set server(newServer: string) {
        this._server = newServer;
    }

    get tags(): string[] {
        return this._tags;
    }

    set tags(newTags: string[]) {
        this._tags = newTags;
    }

    get path_params(): string[] {
        return this._pathParams;
    }

    set path_params(newPathParams: string[]) {
        this._pathParams = newPathParams;
    }
}