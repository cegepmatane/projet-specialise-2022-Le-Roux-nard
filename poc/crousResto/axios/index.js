const axios = require("axios");
const convert = require("xml-js");

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

async function recupererDonneesCrous() {
    const lienPourListeCrous = [
        "https://www.data.gouv.fr/api/2/datasets/5548d35cc751df0767a7b26c/resources/?page=1&type=main&page_size=-1",
        "https://www.data.gouv.fr/api/2/datasets/55f27f8988ee383ebda46ec1/resources/?page=1&type=main&page_size=-1",
        "https://www.data.gouv.fr/api/2/datasets/5548d994c751df32e0a7b26c/resources/?page=1&type=main&page_size=-1"
    ]
    let touteLesReponses = [];

    for (const lien of lienPourListeCrous) {

        let { data: reponse } = await axios({
            method: "get", url: lien, transformResponse: [
                data => JSON.parse(data)?.data.map(e => {
                    let resultat = /^(?<type>\S+).+(?:CROUS\s)(?:(?:de|d')\s?)?(?<nomCrous>.+)/gmi.exec(e.title);
                    return resultat.groups
                })
            ]
        });
        touteLesReponses.push(reponse);
    }

    //récupère tout les types de données dont on dispose
    touteLesReponses = touteLesReponses.flat();
    let listeTypeDonnees = [...new Set(touteLesReponses.flat().map(e => e.type))];
    // console.log(listeTypeDonnees);

    //récupère la liste des crous (présence unique) disponible
    let listeCrousGlobale = [...new Set(touteLesReponses.flat().map(e => e.nomCrous.formatBaseDeDonnees()))];
    listeCrousGlobale = listeCrousGlobale.map(nomCrous => { return { affichage: nomCrous, baseDeDonnees: nomCrous.formatBaseDeDonnees() } });

    // console.log(listeCrousGlobale);
    let listeCrousAvecDonnees = new Map();

    for (const nomCrous of listeCrousGlobale) {

        if (!listeCrousAvecDonnees.get(nomCrous.baseDeDonnees)) {
            // console.log(touteLesReponses.filter(e => e.nomCrous.formatBaseDeDonnees() === nomCrous.baseDeDonnees));
            let donneesDisponibles = touteLesReponses.filter(e => e.nomCrous.formatBaseDeDonnees() === nomCrous.baseDeDonnees).reduce((acc, e) => {
                acc.push(e.type);
                return acc;
            }, []);

            listeCrousAvecDonnees.set(nomCrous.baseDeDonnees, {
                nomCrous: nomCrous.affichage,
                donnees: donneesDisponibles,
            });
        }
    }
    console.log(listeCrousAvecDonnees);
}

(async () => {
    const allCrous = new Map();

    await recupererDonneesCrous();


    // axios({
    //     method: "GET",
    //     url: "https://www.data.gouv.fr/fr/datasets/r/399ff888-42bf-4cf0-a562-c0987dd27d4e",
    //     transformResponse: [
    //         data => JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 }))]
    // }).then(({ data: { root: { restaurant: listeRestaurant } } }) => {
    //     console.log(listeRestaurant)
    // });
})();