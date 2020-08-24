require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingTimeout: 3000,
  pingInterval: 2000,
});
const { ExpressPeerServer } = require("peer");

const moviesRoute = require("./routes/movies.route");
const usersRoute = require("./routes/users.route");
const tokenRoute = require("./routes/token.route");
const boxMovieRoute = require("./routes/boxMovie.route");
const renderRoute = require("./routes/index.route");
const theaterRoute = require("./routes/theaterRoom.route");
const TheaterRoomMember = require("./models/theaterRoomMember.model");

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
  socket.on("new-user", (username, groupId, userId, email) => {
    socket.on("new-message", (username, message) => {
      socket.to(groupId).emit("send-message-other-users", username, message);
    });
    socket.on("new-video", (videoUri) => {
      socket.emit("upload-video", videoUri);
      socket.to(groupId).emit("upload-video", videoUri);
    });
    socket.on("play-all-video", (currentTime) => {
      socket.to(groupId).emit("play-video-user", currentTime);
    });
    socket.on("pause-all-video", (currentTime) => {
      socket.to(groupId).emit("pause-video-user", currentTime);
    });
    socket.emit("fetch-user-online");
    socket.to(groupId).emit("fetch-user-online");
    console.log(groupId);
    socket.join(groupId);
    if (!rooms[groupId]) {
      rooms[groupId] = { users: {} };
    }
    rooms[groupId].users[socket.id] = username;
    socket.to(groupId).emit("user-join", username, userId, groupId);
    socket.on("disconnect-custom", async () => {
      try {
        await TheaterRoomMember.deleteMany({
          email,
          groupId,
        }).lean();
      } catch (error) {
        console.log(error);
      }
      Object.entries(rooms)
        .reduce((disconnectedUsers, [groupId, room]) => {
          if (rooms[groupId].users[socket.id]) {
            disconnectedUsers.push({ room, groupId });
          }
          return disconnectedUsers;
        }, [])
        .forEach(({ room, groupId }) => {
          console.log(room.users[socket.id]);
          if (rooms[groupId].users[socket.id]) {
            socket
              .to(groupId)
              .emit(
                "disconnected-user",
                room.users[socket.id],
                userId,
                groupId
              );
            rooms[groupId].users[socket.id] = null;
          }
        });
    });
    socket.on("disconnect", async () => {
      console.log("disconnect");
      try {
        await TheaterRoomMember.deleteMany({
          email,
          groupId,
        }).lean();
      } catch (error) {
        console.log(error);
      }
      Object.entries(rooms)
        .reduce((disconnectedUsers, [groupId, room]) => {
          if (rooms[groupId].users[socket.id]) {
            disconnectedUsers.push({ room, groupId });
          }
          return disconnectedUsers;
        }, [])
        .forEach(({ room, groupId }) => {
          if (rooms[groupId].users[socket.id]) {
            socket
              .to(groupId)
              .emit(
                "disconnected-user",
                room.users[socket.id],
                userId,
                groupId
              );
            rooms[groupId].users[socket.id] = null;
          }
        });
    });
  });
  socket.on("create-new-room", () => {
    socket.broadcast.emit("fetch-data-rooms");
  });
  socket.on("greeting", (hello) => {
    console.log(hello);
  });
});
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
server.listen(port, () => {
  let port = server.address().port;
  console.log(`Example app listening on port ${port}!`);
});
