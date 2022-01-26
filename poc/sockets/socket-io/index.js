const { spawn } = require("child_process");

const serveur = spawn("node", ["server.js"]);
serveur.stdout.on("data", (data) => {
    process.stdout.write("serveur : " + data.toString());
});

serveur.stderr.on("error", (error) => {
    process.stdout.write("serveur : " + data.toString());
});

const client = spawn("node", ["client.js"]);
client.stdout.on("data", (data) => {
    process.stdout.write("client : " + data.toString());
});

client.stderr.on("error", (error) => {
    process.stdout.write("client : " + data.toString());
});