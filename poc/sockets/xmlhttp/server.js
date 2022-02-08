console.log("Lancement du seveur...");

const express = require('express');
const app = express();

const rateLimit = require('express-rate-limit')
const wssRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1, // Limit each IP to 1 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
const apiRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1, // Limit each IP to 1 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
const websiteRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1, // Limit each IP to 1 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const abonnes = [];
let nouvellesDonnees = null;

app.use("/wss/register", wssRateLimit);
app.get('/wss/register', (req, res) => {
    if (!abonnes.includes(req.ip)) {
        abonnes.push(req.ip);
        res.status(200).send("OK");
    } else {
        res.status(401).send("KO");
    }
});

app.get('/wss/ping', (req, res) => {
    if (nouvellesDonnees) {
        res.send(nouvellesDonnees);
        abonnes.splice(abonnes.indexOf(req.ip), 1);
    } else {
        res.status(401).send("KO");
    }
});

app.use("/api", apiRateLimit);
app.get("/api", (req, res) => {
    res.send("Bienvenue sur l'API!")
})

app.use("/", websiteRateLimit);
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`En écoute sur le port ${PORT}`);
});

setTimeout(() => {
    nouvellesDonnees = "ping";
}, 10000);
