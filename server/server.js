const express = require("express");
const app = express();
const path = require("path");
const sqlite = new (require("./database/SQLiteDatabase"))();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" }
});

app.use("/public", express.static("../client/public"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"))
});

let connected_client = -1;

io.on("connection", socket => {
    connected_client++;
    io.sockets.emit("device", connected_client);
    socket.on("message", data => {
        const { html_data, message, username } = data;
        //sqlite.saveMessage(username, message);
        io.sockets.send(html_data);
    });

    socket.on("keydown", username => {
        io.sockets.emit("keydown", username)
    })

    socket.on("disconnect", () => {
        connected_client--;
        io.sockets.emit("device", connected_client);
    });
})

server.listen(8000, () => console.log("Server listening..."));