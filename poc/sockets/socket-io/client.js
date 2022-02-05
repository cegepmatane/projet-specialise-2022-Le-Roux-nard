const { io } = require("socket.io-client");
const socket = io("http://localhost:8080");

socket.io.on("error", (error) => {
    console.error(error);
});

socket.io.on("reconnect", () => {
    console.log("Reconnection...");
});

socket.on("connect", () => {
    socket.emit("ping");
    socket.on("pong", (...args) => {
        console.log(args.join(""));
    });
});

console.log("Le client est lancé...");