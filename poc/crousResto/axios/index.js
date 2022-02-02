const axios = require("axios");
const convert = require("xml-js");

(async () => {
    axios({
        method: "GET",
        url: "http://webservices-v2.crous-mobile.fr/feed/versailles/externe/resto.xml",
        transformResponse: [
            data => JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 }))]
    }).then(res => console.log(res.data));

    // JSON.parse(convert.xml2json(await res.text(), { compact: true, nativeType: true }))
})();