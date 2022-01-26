const { spawn } = require("child_process");

const server = spawn("node", ["server.js"]);
server.stdout.on("data", (data) => {
    process.stdout.write("SERVER : " + data.toString());
});

server.stderr.on("error", (error) => {
    process.stdout.write("SERVER : " + data.toString());
});

const client = spawn("node", ["client.js"]);
client.stdout.on("data", (data) => {
    process.stdout.write("CLIENT : " + data.toString());
});

client.stderr.on("error", (error) => {
    process.stdout.write("CLIENT : " + data.toString());
});