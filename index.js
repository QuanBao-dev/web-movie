require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const io = require("socket.io")(server, { wsEngine: "ws" });
const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  path: "/",
});
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("connected to db");
    }
  }
);
let rooms = {};
io.on("connection", (socket) => {
  console.log("connected to websocket");
  socket.on("new-user", (username, groupId, userId) => {
    socket.join(groupId);
    if (!rooms[groupId]) {
      rooms[groupId] = { users: {} };
    }
    rooms[groupId].users[socket.id] = username;
    socket.to(groupId).emit("user-join", username, userId);
    socket.on("disconnect", () => {
      socket.to(groupId).emit("disconnected-user-video", userId);
    });
  });
  socket.on("create-new-room", () => {
    socket.broadcast.emit("fetch-data-rooms");
  });
  socket.on("greeting", (hello) => {
    console.log(hello);
  });
  socket.on("disconnect", () => {
    Object.entries(rooms)
      .reduce((disconnectedUsers, [groupId, room]) => {
        if (rooms[groupId].users[socket.id]) {
          disconnectedUsers.push({ room, groupId });
        }
        return disconnectedUsers;
      }, [])
      .forEach(({ room, groupId }) => {
        socket.to(groupId).emit("disconnected-user", room.users[socket.id]);
        delete rooms[groupId].users[socket.id];
      });
  });
});
const moviesRoute = require("./routes/movies.route");
const usersRoute = require("./routes/users.route");
const tokenRoute = require("./routes/token.route");
const boxMovieRoute = require("./routes/boxMovie.route");
const renderRoute = require("./routes/index.route");
const theaterRoute = require("./routes/theaterRoom.route");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use("/peerjs", peerServer);
app.use("/api/theater/", theaterRoute);
app.use("/api/movies/box", boxMovieRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/users", usersRoute);
app.use("/api/", tokenRoute);
app.use("/", renderRoute);
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
