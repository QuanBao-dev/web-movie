require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingTimeout: 5000,
  pingInterval: 3000,
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
io.on("connect", async (socket) => {
  console.log(rooms);
  console.log("connected to websocket", socket.id);
  socket.emit("greeting");
});

io.on("connection", (socket) => {
  socket.on("new-user", async (username, groupId, userId, email) => {
    console.log(username);
    if (!rooms[groupId]) {
      rooms[groupId] = { users: {} };
    }
    socket.join(groupId);
    console.log(username, "join", groupId);
    socket.emit("fetch-user-online");
    socket.to(groupId).emit("fetch-user-online");
    rooms[groupId].users[userId] = username;

    await TheaterRoomMember.findOneAndUpdate(
      {
        email,
        groupId,
      },
      {
        userId,
        username,
        joinAt: Date.now(),
        keepRemote: false,
      },
      {
        upsert: true,
        new: true,
      }
    )
      .lean()
      .select({ _id: false, __v: false });
    socket.to(groupId).emit("user-join", username, userId, groupId);
    socket.on("fetch-updated-user-online", () => {
      socket.emit("fetch-user-online");
      socket.to(groupId).emit("fetch-user-online");
    });

    socket.on("new-video", (videoUri, groupId, uploadOtherVideo) => {
      socket.broadcast.emit(
        "upload-video",
        videoUri,
        groupId,
        uploadOtherVideo
      );
    });
    socket.on("user-keep-remote-changed", (groupId) => {
      socket.broadcast.emit("change-user-keep-remote", groupId);
    });
    socket.on("play-all-video", (currentTime, groupId) => {
      socket.broadcast.emit("play-video-user", currentTime, groupId);
    });
    socket.on("pause-all-video", (currentTime, groupId) => {
      socket.broadcast.emit("pause-video-user", currentTime, groupId);
    });
    socket.on("disconnect", async () => {
      await TheaterRoomMember.deleteMany({
        email,
        groupId,
      }).lean();
      if (rooms[groupId] && rooms[groupId].users[userId]) {
        socket.emit("disconnected-user", username, userId, groupId);
        socket.to(groupId).emit("disconnected-user", username, userId, groupId);
        delete rooms[groupId].users[userId];
        if (Object.keys(rooms[groupId].users).length === 0) {
          delete rooms[groupId];
        }
      }
    });
    socket.on("disconnect-custom", async () => {
      console.log("disconnect");
      await TheaterRoomMember.deleteMany({
        email,
        groupId,
      }).lean();
      if (rooms[groupId] && rooms[groupId].users[userId]) {
        socket.to(groupId).emit("disconnected-user", username, userId, groupId);
        delete rooms[groupId].users[userId];
        if (Object.keys(rooms[groupId].users).length === 0) {
          delete rooms[groupId];
        }
      }
    });
  });

  socket.on("new-message", (username, message, groupId) => {
    socket.broadcast.emit(
      "send-message-other-users",
      username,
      message,
      groupId
    );
  });
  socket.on("user-join-watch", (malId, username) => {
    if (!rooms[malId]) {
      rooms[malId] = { users: {} };
    }
    rooms[malId].users[socket.id] = username;
    console.log(rooms);
    socket.join(malId);
  });
  socket.on("create-new-room", () => {
    socket.broadcast.emit("fetch-data-rooms");
  });

  socket.on("disconnect-custom", async () => {
    Object.entries(rooms)
      .reduce((disconnectedUsers, [malId, room]) => {
        if (rooms[malId].users[socket.id]) {
          disconnectedUsers.push({ room, malId: malId });
        }
        return disconnectedUsers;
      }, [])
      .forEach(({ room, malId }) => {
        if (rooms[malId].users[socket.id]) {
          socket
            .to(malId)
            .emit("disconnected-user", room.users[socket.id], socket.id, malId);
          delete rooms[malId].users[socket.id];
          if (Object.keys(rooms[malId].users).length === 0) {
            delete rooms[malId];
          }
        }
      });
  });

  socket.on("disconnect", async () => {
    Object.entries(rooms)
      .reduce((disconnectedUsers, [malId, room]) => {
        if (rooms[malId].users[socket.id]) {
          disconnectedUsers.push({ room, malId: malId });
        }
        return disconnectedUsers;
      }, [])
      .forEach(({ room, malId }) => {
        if (rooms[malId].users[socket.id]) {
          socket
            .to(malId)
            .emit("disconnected-user", room.users[socket.id], socket.id, malId);
          delete rooms[malId].users[socket.id];
          if (Object.keys(rooms[malId].users).length === 0) {
            delete rooms[malId];
          }
        }
      });
  });
});

TheaterRoomMember.watch().on("change", async () => {
  io.emit("mongo-change-watch");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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
