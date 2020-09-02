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
io.on("connection", (socket) => {
  console.log("connected to websocket");
  socket.on("new-message", (username, message, groupId) => {
    try {
      socket
        .to(groupId)
        .emit("send-message-other-users", username, message, groupId);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("user-join-watch", (malId, username) => {
    try {
      if (!rooms[malId]) {
        rooms[malId] = { users: {} };
      }
      rooms[malId].users[socket.id] = username;
      console.log(rooms);
      socket.join(malId);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("create-new-room", () => {
    socket.broadcast.emit("fetch-data-rooms");
  });

  socket.on("disconnect-custom", async () => {
    console.log("disconnect user");
    try {
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
              .emit(
                "disconnected-user",
                room.users[socket.id],
                socket.id,
                malId
              );
            delete rooms[malId].users[socket.id];
            if (Object.keys(rooms[malId].users).length === 0) {
              delete rooms[malId];
            }
          }
        });
    } catch (error) {
      console.log("disconnect", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("disconnect user");
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

  socket.on("new-user", (username, groupId, userId, email) => {
    try {
      socket.emit("fetch-user-online");
      socket.to(groupId).emit("fetch-user-online");
      socket.join(groupId);
      if (!rooms[groupId]) {
        rooms[groupId] = { users: {} };
      }
    } catch (error) {
      console.log("new-user", error);
    }
    socket.on("fetch-updated-user-online", () => {
      try {
        socket.emit("fetch-user-online");
        socket.to(groupId).emit("fetch-user-online");
      } catch (error) {
        console.log("fetch-updated-user-online error", error);
      }
    });
    socket.on("new-video", (videoUri, groupId, uploadOtherVideo) => {
      try {
        socket
          .to(groupId)
          .emit("upload-video", videoUri, groupId, uploadOtherVideo);
      } catch (error) {
        console.log("new-video", error);
      }
    });
    socket.on("user-keep-remote-changed", (groupId) => {
      try {
        socket.to(groupId).emit("change-user-keep-remote", groupId);
      } catch (error) {
        console.log("user-keep-remote-changed", error);
      }
    });
    socket.on("play-all-video", (currentTime, groupId) => {
      try {
        socket.to(groupId).emit("play-video-user", currentTime, groupId);
      } catch (error) {
        console.log("play-all-video error", error);
      }
    });
    socket.on("pause-all-video", (currentTime, groupId) => {
      try {
        socket.to(groupId).emit("pause-video-user", currentTime, groupId);
      } catch (error) {
        console.log("pause-all-video", error);
      }
    });
    try {
      rooms[groupId].users[userId] = username;
      console.log(rooms);
      socket.to(groupId).emit("user-join", username, userId, groupId);
    } catch (error) {
      console.log("user-join", error);
    }
    socket.on("disconnect", async () => {
      try {
        await TheaterRoomMember.deleteMany({
          email,
          groupId,
        }).lean();
      } catch (error) {
        console.log(error);
      }
      try {
        Object.entries(rooms)
          .reduce((disconnectedUsers, [groupId, room]) => {
            if (rooms[groupId].users[userId]) {
              disconnectedUsers.push({ room, groupId });
            }
            return disconnectedUsers;
          }, [])
          .forEach(({ room, groupId }) => {
            if (rooms[groupId].users[userId]) {
              socket
                .to(groupId)
                .emit("disconnected-user", room.users[userId], userId, groupId);
              console.log("disconnect", room.users[userId]);
              delete rooms[groupId].users[userId];
              if (Object.keys(rooms[groupId].users).length === 0) {
                delete rooms[groupId];
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("disconnect-custom", async () => {
      console.log("disconnect");
      try {
        await TheaterRoomMember.deleteMany({
          email,
          groupId,
        }).lean();
      } catch (error) {
        console.log(error);
      }
      try {
        Object.entries(rooms)
          .reduce((disconnectedUsers, [groupId, room]) => {
            if (rooms[groupId].users[userId]) {
              disconnectedUsers.push({ room, groupId });
            }
            return disconnectedUsers;
          }, [])
          .forEach(({ room, groupId }) => {
            if (rooms[groupId].users[userId]) {
              socket
                .to(groupId)
                .emit("disconnected-user", room.users[userId], userId, groupId);
              delete rooms[groupId].users[userId];
              if (Object.keys(rooms[groupId].users).length === 0) {
                delete rooms[groupId];
              }
            }
          });
      } catch (error) {
        console.log("disconnect user", error);
      }
    });
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
