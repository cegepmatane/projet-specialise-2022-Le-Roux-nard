const fetch = require("node-fetch");
const convert = require("xml-js");

(async () => {
    fetch("http://webservices-v2.crous-mobile.fr/feed/versailles/externe/resto.xml").then(async res =>
        JSON.parse(convert.xml2json(await res.text(), { compact: true, nativeType: true }))
    ).then(data => {
        console.log(data);
    })
})();