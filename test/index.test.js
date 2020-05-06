const main = require('../index');

test("load smartapi from file path", async () => {
    const mygene = new main.API("./smartapi/mygene.json");
    await mygene.loadSmartAPI();
    expect(mygene.smartapiDoc["openapi"]).toBe("3.0.0");
})