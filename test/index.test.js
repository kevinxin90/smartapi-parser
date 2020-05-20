const main = require('../index');

test("load smartapi from file path", async () => {
    const mygene = new main.API("./smartapi/mygene.json");
    await mygene.loadSmartAPI();
    expect(mygene.smartapiDoc["openapi"]).toBe("3.0.0");
    const wrong = new main.API("./smartapi/notexist.json");
    try {
        await wrong.loadSmartAPI();
    } catch (e) {
        expect(e.message).toEqual('Unable to load your input file')
    }
})

describe('test API parser', () => {
    let mygene;
    beforeAll(async () => {
        mygene = new main.API("./smartapi/mygene.json");
        await mygene.loadSmartAPI();
    });
  
    test('test parse API name', () => {
        expect(mygene.fetchAPIName()).toBe('MyGene.info API');
    });

    test('test parse API Tags', () => {
        expect(mygene.fetchAPITags()).toContain("biothings");
    });

    test("test parse server url", () => {
        expect(mygene.fetchServerUrl()).toBe("https://mygene.info/v3");
    });

    test("test fetch response mapping", () => {
        expect(mygene.fetchResponseMapping(""))
    })
  
});