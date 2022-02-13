const axios = require("axios");
// const convert = require("xml-js");

String.prototype.snake = function () {
    return this.escape()
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_');
};

String.prototype.escape = function () {
    var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'";
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz ";
    let s = this.split("");
    let strLen = s.length;
    let i, x;
    for (i = 0; i < strLen; i++) {
        if (this[i] !== "'") {
            if ((x = accents.indexOf(this[i])) != -1) {
                s[i] = accentsOut[x];
            }
        } else {
            s.splice(i, 1);
        }
    }
    return s.join("");
};

String.prototype.formatBaseDeDonnees = function () {
    return this.trim().toLowerCase().snake();
}


const DATASET_URL_PREFIX = "https://www.data.gouv.fr/fr/datasets/r/";

const lienPourListeCrous = [
    "https://www.data.gouv.fr/api/2/datasets/5548d35cc751df0767a7b26c/resources/?page=1&type=main&page_size=-1",
    "https://www.data.gouv.fr/api/2/datasets/55f27f8988ee383ebda46ec1/resources/?page=1&type=main&page_size=-1",
    "https://www.data.gouv.fr/api/2/datasets/5548d994c751df32e0a7b26c/resources/?page=1&type=main&page_size=-1"
];

async function recupererDonneesCrous() {

    let listeCROUS = new Map();

    for (const lien of lienPourListeCrous) {

        let { data: reponse } = await axios({
            method: "get", url: lien, transformResponse: [
                data => JSON.parse(data)?.data]
        });

        for (const ressource of reponse) {
            let { groups: { type, nomCrous } } = /^(?<type>\S+).+(?:CROUS\s)(?:(?:de|d')\s?)?(?<nomCrous>.+)/gmi.exec(ressource.title);
            nomCrous = { affichage: nomCrous, baseDeDonnees: nomCrous.formatBaseDeDonnees() };
            if (!listeCROUS.get(nomCrous.baseDeDonnees)) {
                listeCROUS.set(nomCrous.baseDeDonnees, {
                    nomCrous: nomCrous.affichage,
                    donneesDisponibles: new Map().set(type.formatBaseDeDonnees(), { type, id: ressource.id }),
                    donnees: new Map()
                });
            } else {
                listeCROUS.get(nomCrous.baseDeDonnees).donneesDisponibles.set(type.formatBaseDeDonnees(), { type, id: ressource.id });
            }
        }
    }
    return listeCROUS;
}

(async () => {
    const allCrous = await recupererDonneesCrous();

    // axios({
    //     method: "GET",
    //     url: "https://www.data.gouv.fr/fr/datasets/r/399ff888-42bf-4cf0-a562-c0987dd27d4e",
    //     transformResponse: [
    //         data => JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 }))]
    // }).then(({ data: { root: { restaurant: listeRestaurant } } }) => {
    //     console.log(listeRestaurant)
    // });
})();