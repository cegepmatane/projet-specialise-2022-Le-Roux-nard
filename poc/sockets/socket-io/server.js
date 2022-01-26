const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let tousLesSockets = new Map();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });

    socket.on("ping", () => {
        tousLesSockets.set(socket.id, socket);
    })
});


const PORT = 3015;
server.listen(PORT, () => {
    console.log(`En écoute sur le port ${PORT}`);
});

setTimeout(() => {
    console.log(`Données renouvelées, envoi des données à ${tousLesSockets.size} utilisateurs`);
    for (let socket of tousLesSockets.values()) {
        socket.emit("pong", ["pong"]);
    }
}, 2500);