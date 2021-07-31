require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const sslRedirect = require("heroku-ssl-redirect").default;
const io = require("socket.io")(server);
const compression = require("compression");
cloudinary.config({
  cloud_name: "storagecloud",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const { ExpressPeerServer } = require("peer");

const moviesRoute = require("./routes/movies.route");
const usersRoute = require("./routes/users.route");
const tokenRoute = require("./routes/token.route");
const boxMovieRoute = require("./routes/boxMovie.route");
const renderRoute = require("./routes/index.route");
const theaterRoute = require("./routes/theaterRoom.route");
const faqRoute = require("./routes/faq.route");
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
TheaterRoomMember.watch().on("change", async (a) => {
  io.emit("mongo-change-watch");
});

io.on("connection", (socket) => {
  socket.on(
    "new-user",
    async (avatar, username, groupId, userId, publicUserId) => {
      console.log(username);
      if (!rooms[groupId]) {
        rooms[groupId] = { users: {} };
      }
      console.log(username, "join", groupId);
      rooms[groupId].users[userId] = username;
      try {
        const members = await TheaterRoomMember.find({ groupId })
          .select({ _id: 0, keepRemote: 1, userId: 1 })
          .lean();
        const isContainedMemberHavingRemote = !!members.find(
          (member) => member.keepRemote === true
        );
        const newMember = new TheaterRoomMember({
          userId: publicUserId,
          groupId,
          username,
          avatar,
          joinAt: Date.now(),
          keepRemote: !isContainedMemberHavingRemote,
        });
        await newMember.save();
      } catch (error) {
        console.log("something went wrong");
      }
      socket.broadcast.emit("user-join", userId, groupId);
      socket.emit("fetch-user-online");
      socket.broadcast.emit("fetch-user-online");
      socket.on("delete-specific-member", async (publicUserId, groupId) => {
        await TheaterRoomMember.deleteOne({
          userId: publicUserId,
          groupId,
        }).lean();
      });

      socket.on(
        "new-video",
        (videoUri, groupId, uploadOtherVideo, transcriptUrl) => {
          socket.broadcast.emit(
            "upload-video",
            videoUri,
            groupId,
            uploadOtherVideo,
            transcriptUrl
          );
        }
      );
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
        console.log("disconnect");
        await TheaterRoomMember.deleteOne({
          userId: publicUserId,
          groupId,
        }).lean();
        if (rooms[groupId] && rooms[groupId].users[userId]) {
          socket.broadcast.emit("disconnected-user", userId);
          delete rooms[groupId].users[userId];
          if (Object.keys(rooms[groupId].users).length === 0) {
            delete rooms[groupId];
          }
        }
      });
    }
  );
  socket.on("notify-user-typing", (groupId, idUserTyping, username) => {
    socket.broadcast.emit("new-user-typing", groupId, idUserTyping, username);
  });

  socket.on("notify-user-stop-type", (groupId, idTyping) => {
    socket.broadcast.emit("eliminate-user-typing", groupId, idTyping);
  });

  socket.on("new-message", (username, message, groupId, avatar) => {
    socket.broadcast.emit(
      "send-message-other-users",
      username,
      message,
      groupId,
      avatar
    );
  });
  socket.on("new-message-photo", (username, uri, groupId, avatar) => {
    socket.broadcast.emit(
      "send-message-photo-other-users",
      username,
      uri,
      groupId,
      avatar
    );
  });

  socket.on("new-user-seen", (avatar, groupId) => {
    socket.broadcast.emit(
      "send-avatar-seen-user-to-other-user",
      avatar,
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

  socket.on("disconnect", async () => {
    console.log("disconnect malId");
    Object.entries(rooms)
      .reduce((disconnectedUsers, [malId, room]) => {
        if (rooms[malId].users[socket.id]) {
          disconnectedUsers.push({ room, malId: malId });
        }
        return disconnectedUsers;
      }, [])
      .forEach(({ room, malId }) => {
        if (rooms[malId].users[socket.id]) {
          socket.broadcast.emit("disconnected-user", socket.id);
          delete rooms[malId].users[socket.id];
          if (Object.keys(rooms[malId].users).length === 0) {
            delete rooms[malId];
          }
        }
      });
  });
});

app.use(sslRedirect());
app.use(compression());
app.disable("X-Powered-By");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production")
    res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});
app.use("/peerjs", peerServer);
app.use("/api/faq", faqRoute);
app.use("/api/theater/", theaterRoute);
app.use("/api/movies/box", boxMovieRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/users", usersRoute);
app.use("/api/", tokenRoute);
app.use("/", renderRoute);
io.listen(server);
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
