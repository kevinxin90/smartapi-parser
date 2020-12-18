import api = require("../src/index");
const loadJsonFile = require("load-json-file");

describe('test API parser', () => {
    let mygene: any, metadata, ops;
    beforeAll(() => {
        mygene = loadJsonFile.sync("./smartapi/mygene.json")
        mygene = new api(mygene);
    });

    test('test parse API name', () => {
        expect(mygene.fetchAPITitle()).toBe('MyGene.info API');
    });

    test('test parse API Tags', () => {
        expect(mygene.fetchAPITags()).toContain("biothings");
    });

    test("test parse server url", () => {
        expect(mygene.fetchServerUrl()).toBe("https://mygene.info/v3");
    });

    test("test parse component", () => {
        expect(mygene.fetchComponents()).not.toBeUndefined();
    });

    test("test fetch meta data", () => {
        metadata = mygene.fetchAPIMeta();
        expect(metadata.title).toBe("MyGene.info API");
        expect(metadata.tags).toContain("biothings");
        expect(metadata.url).toBe("https://mygene.info/v3");
        expect(metadata.components).not.toBeUndefined();
    })

    test("test fetch all operations", () => {
        ops = mygene.fetchAllOpts();
        expect(ops[0].association.api_name).toBe("MyGene.info API")
    })
});

describe('test API parser which is already dereferenced', () => {
    let opentarget: any, metadata, ops;
    beforeAll(() => {
        opentarget = loadJsonFile.sync("./smartapi/opentarget.json")
        opentarget = new api(opentarget);
    });

    test("test parse component", () => {
        expect(opentarget.fetchComponents()).toBeUndefined();
    });

    test("test fetch meta data", () => {
        metadata = opentarget.fetchAPIMeta();
        expect(metadata.title).toBe("OpenTarget API");
        expect(metadata.tags).toContain("translator");
        expect(metadata.url).toBe("https://platform-api.opentargets.io/v3");
        expect(metadata.components).toBeUndefined();
    })

    test("test fetch all operations", () => {
        ops = opentarget.fetchAllOpts();
        expect(ops[0].association.api_name).toBe("OpenTarget API");
        expect(ops[0].association.predicate).toBe('biolink:related_to');
        expect(ops[0].association.input_id).toBe('biolink:ENSEMBL');
        expect(ops[0].query_operation.path).toBe('/platform/public/evidence/filter');
    })
});

describe('test API parser using specs with path parameters', () => {
    let litvar: any, path_params;
    beforeAll(() => {
        litvar = loadJsonFile.sync("./smartapi/litvar.json")
        litvar = new api(litvar);
    });

    test("test path params", () => {
        path_params = litvar.metadata.operations[0]['query_operation']['path_params'];
        expect(path_params).toStrictEqual(['variantid']);
    });
});

describe('test API parser when input is empty', () => {
    let mygene: any = {};
    beforeAll(() => {
        mygene = new api(mygene);
    });

    test('test parse API name', () => {
        expect(mygene.fetchAPITitle()).toBeUndefined();
    });

    test('test parse API Tags', () => {
        expect(mygene.fetchAPITags()).toBeUndefined();
    });

    test("test parse server url", () => {
        expect(mygene.fetchServerUrl()).toBeUndefined();
    });

    test("test parse component", () => {
        expect(mygene.fetchComponents()).toBeUndefined();
    });

});

describe('test API parser when input is mal-structured', () => {
    let mygene: any = { 'hello': 'world' };
    beforeAll(() => {
        mygene = new api(mygene);
    });

    test('test parse API name', () => {
        expect(mygene.fetchAPITitle()).toBeUndefined();
    });

    test('test parse API Tags', () => {
        expect(mygene.fetchAPITags()).toBeUndefined();
    });

    test("test parse server url", () => {
        expect(mygene.fetchServerUrl()).toBeUndefined();
    });

    test("test parse component", () => {
        expect(mygene.fetchComponents()).toBeUndefined();
    });
});