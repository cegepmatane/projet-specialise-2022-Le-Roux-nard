console.log("Lancement du seveur...");

const express = require('express');
const app = express();

const abonnes = [];
let nouvellesDonnees = null;

app.get('/register', (req, res) => {
    if (!abonnes.includes(req.ip)) {
        abonnes.push(req.ip);
        res.status(200).send("OK");
    } else {
        res.status(401).send("KO");
    }
});

app.get('/ping', (req, res) => {
    if (nouvellesDonnees) {
        res.send(nouvellesDonnees);
        abonnes.splice(abonnes.indexOf(req.ip),1);
    } else {
        res.status(401).send("KO");
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`En écoute sur le port ${PORT}`);
});

setTimeout(() => {
    nouvellesDonnees = "ping";
}, 10000);
