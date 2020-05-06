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

