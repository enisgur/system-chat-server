const http = require("http");
const express = require("express");
const moment = require("moment");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// my library
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUsser,
  getUsers,
  userLeave,
  userChangeRoom,
} = require("./utils/users");

const { chatHistory, addHistory } = require("./utils/chatHistory");

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Disable Security on local
  res.header("Access-Controll-Allow-Headers", "Content-Type");
  next();
});

// my Variables
const botName = "SERVER";
const wellcomeMessage = "Wellcome to Family Chat";

app.get("/", async (req, res) => {
  res.send({ response: "hello" });
});

// SOCKET IO
io.on("connection", (socket) => {
  // Wellcome current user
  console.log("New client connection..");

  // Send chat history to new connected client
  // fix here chat history   fix 1111
  // socket.emit("chathistory", chatHistory);

  // get username of current joined user
  socket.on("join", async ({ username, room }) => {
    // //  room must be array !
    // if (!Array.isArray(room)) {
    //   socket.emit("error", "User room must be array");
    //   io.sockets.sockets[socket.id].disconnect();
    //   return;
    // }

    // fix here 1111    check if array is null : [] or [""] etc..

    console.log("From Join: ", username, room);

    // const user = userJoin(socket.id, username, room);
    await userJoin(socket.id, username, room);

    // addHistory(formatMessage(botName, `${username} has joined the channel`));

    socket.join(room);

    const formatedMessage = await formatMessage(
      botName,
      `${username}, has joined the channel.`,
      room
    );

    io.in(room).emit("message", formatedMessage);

    io.emit("roomUsers", {
      users: getUsers(),
    });
  });

  socket.on("changeRoom", async ({ username, room }) => {
    const user = await getCurrentUsser(socket.id);
    console.log("socket prev room : ", user.room);

    const changeRoomFormatedMessage = await formatMessage(
      botName,
      `${user.username} left the room`,
      user.room
    );

    socket.broadcast.to(user.room).emit("message", changeRoomFormatedMessage);

    socket.leave(user.room);
    socket.join(room);
    const newUser = await userChangeRoom(socket.id, user.username, room);

    console.log(newUser);

    const changeRoomFormatedMessage2 = await formatMessage(
      botName,
      `${user.username} has joined the room.`,
      newUser.room
    );
    socket.broadcast
      .to(newUser.room)
      .emit("message", changeRoomFormatedMessage2);

    io.emit("roomUsers", {
      users: getUsers(),
    });

    // socket.to()
  });

  // Listen for chatMessage
  socket.on("chatMessage", async (msg) => {
    const user = getCurrentUsser(socket.id);
    console.log("chatMessage room :  ", msg);

    let formatedMessage = await formatMessage(
      user.username,
      msg.message,
      msg.room
    );

    // console.log("CHECKK 1111111 : ", formatedMessage);
    // console.log("CHECKK 2222222 : ", user);

    io.in(formatedMessage.room).emit("message", formatedMessage);

    // [
    //   {
    //     room: "#general",
    //     messages: [
    //       {
    //         username: "SERVER",
    //         text: "c has joined the channel",
    //         time: "1:06 am",
    //       },
    //       { username: "c", text: "naber", time: "1:06 am" },
    //       { username: "c", text: "naber", time: "1:06 am" },
    //       { username: "c", text: "zzzzzzzzzzz", time: "1:06 am" },
    //       { username: "c", text: "zzzzzzzzzzz", time: "1:06 am" },
    //       { username: "c", text: "lll", time: "1:07 am" },
    //       { username: "c", text: "lll", time: "1:07 am" },
    //     ],
    //   },
    // ];

    // console.log(
    //   JSON.stringify(formatMessage(user.username, msg.message, msg.room))
    // );
    // console.log(user.username, msg);
    // console.log(msg.message);
    // console.log(msg.room);
    // console.log(user.username);
    // callback();
  });

  socket.on("privateMessage", async (msg) => {
    const { sender, receiver } = msg;
    // const senderID = sender.id;
    // const senderUsername = sender.username;
    // const message = sender.text;

    // const receiverID = receiver.id;

    io.to(receiver.id).emit("private", msg);
    io.to(sender.id).emit("private", msg);
  });

  // Runs when client dissconnects
  socket.on("disconnect", async () => {
    console.log("user disconnected");
    const user = userLeave(socket.id);
    if (user) {
      const disconnectFormatedMessage = await formatMessage(
        botName,
        `${user.username}, has left the chat!`,
        user.room
      );

      io.in(user.room).emit("message", disconnectFormatedMessage);
      io.emit("roomUsers", {
        users: getUsers(),
      });
    }
  });
});
// SOCKET IO END();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
