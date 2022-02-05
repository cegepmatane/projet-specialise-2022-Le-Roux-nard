const axios = require("axios");
const convert = require("xml-js");

(async () => {
    axios({
        method: "GET",
        url: "https://www.data.gouv.fr/fr/datasets/r/399ff888-42bf-4cf0-a562-c0987dd27d4e",
        transformResponse: [
            data => JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 }))]
    }).then(({ data: { root: { restaurant: listeRestaurant } } }) => {
        console.log(listeRestaurant)
    });
})();