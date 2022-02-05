const fetch = require("node-fetch");
const convert = require("xml-js");

(async () => {
    fetch("https://www.data.gouv.fr/fr/datasets/r/399ff888-42bf-4cf0-a562-c0987dd27d4e").then(async res =>
        JSON.parse(convert.xml2json(await res.text(), { compact: true, nativeType: true }))
    ).then(data => {
        console.log(data);
    })
})();
// 