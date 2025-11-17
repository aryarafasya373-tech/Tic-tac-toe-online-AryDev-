const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/"));

io.on("connection", (socket) => {
  console.log("User joined");

  socket.on("move", data => {
    socket.broadcast.emit("move", data);
  });

  socket.on("reset", () => {
    io.emit("reset");
  });
});

server.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});