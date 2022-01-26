const fetch = require('node-fetch');
console.log("Lancement du client...");

(async () => {

    var res;

    while (res?.status != 200) {
        console.log("Envoi d'une requête...");
        await fetch("http://localhost:3015/register").then((reponseServeur) => {
            res = reponseServeur;
        })
    }

    let intervalBoucle = setInterval(() => {
        fetch("http://localhost:3015/ping").then(async(reponseServeur) => {
            res = reponseServeur;
            if (res?.status == 200) {
                intervalBoucle.unref();
                console.log(`Données reçues : ${await res.text()}`);
            } else {
                console.log("Données non reçues");
            }
        })
    }, 1000)
})();