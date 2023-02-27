const path = require("path");
const session = require('express-session');
const console = require("console");
const express = require('express');
const app = express();
const server = require("http").Server(app);
const { ExpressPeerServer } = require("peer");

app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

// Create socket.io instance and use cors
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Create peerjs server instance and wrap it with http.Server
const peerServer = ExpressPeerServer(server);
app.use("/peerjs", peerServer);

app.use(express.static('public'));

// Handle socket.io events
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);

    setTimeout(() => {
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 5000);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Application routes
const Routes = require('./routes/route');
app.use(Routes);

server.listen(process.env.PORT || 3333, () => {
  console.log("Server started on port 3333");
});