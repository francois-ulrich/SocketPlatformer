"use strict";
exports.__esModule = true;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = http_1.createServer();
var io = new socket_io_1.Server(httpServer, {
// ...
});
io.on('connection', function (socket) {
    console.log(socket.id);
});
httpServer.listen(3001);
