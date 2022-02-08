const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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

let tousLesSockets = new Map();
const wssWorkspace = io.of("/wss");
app.use("/wss", wssRateLimit);
wssWorkspace.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });

    socket.on("ping", () => {
        tousLesSockets.set(socket.id, socket);
    })
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
server.listen(PORT, () => {
    console.log(`En écoute sur le port ${PORT}`);
});

setTimeout(() => {
    console.log(`Données renouvelées, envoi des données à ${tousLesSockets.size} utilisateurs`);
    for (let socket of tousLesSockets.values()) {
        wssWorkspace.emit("pong", ["pong"]);
    }
}, 2500);