import QueryOperationObject from '../src/query_operation';

describe("Test QueryOperationObject class", () => {
    describe("Test xBTEKGSOperation setter function", () => {
        test("missing fields should return undefined", () => {
            const op = {
                parameters: {
                    gene: "{inputs[0]}"
                },
                requestBody: {
                    id: "{inputs[1]"
                },
                supportBatch: false,
                inputs: [{
                    id: "NCBIGene",
                    semantic: "Gene"
                }],
                outputs: [{
                    id: "NCBIGene",
                    semantic: "Gene"
                }],
                predicate: "related_to",
                response_mapping: {}
            }
            const obj = new QueryOperationObject();
            obj.xBTEKGSOperation = op;
            expect(obj.inputSeparator).toBeUndefined();
        })
    })
})