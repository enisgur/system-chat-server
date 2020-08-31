const http = require("http");
const express = require("express");
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

app.get("/", async (req, res) => {
  res.send({ response: "hello" });
});

// SOCKET IO
io.on("connection", (socket) => {
  // Wellcome current user
  console.log("New client connection..");

  // Send chat history to new connected client
  socket.emit("chathistory", chatHistory);

  // get username of current joined user
  socket.on("join", ({ username, room }) => {
    userJoin(socket.id, username, room);

    // addHistory(formatMessage(botName, `${username} has joined the channel`));

    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${username} has joined the channel`)
    );

    // Send all users to room with new connected user
    io.emit("roomUsers", {
      users: getUsers(),
    });
  });

  // on check duplicate username on login page
  socket.on("getRoomUsers", async (usr) => {
    let activeUsers = {
      users: getUsers(),
    };

    let isDuplicateUsername = activeUsers.users.map((aUsrs) => {
      if (aUsrs.username == usr) {
        return true;
      } else {
        return false;
      }
    });

    let checkDuplicate = isDuplicateUsername[0];

    // console.log(isDuplicateUsername[0]);

    // Emit login page to if username is duplicated or not
    socket.emit("isDuplicateUser", checkDuplicate);
  });

  // dissconnect user
  socket.on("disconnectDuplicate", (usrID) => {
    if (io.sockets.sockets[usrID]) {
      io.sockets.sockets[usrID].disconnect();
    }
  });

  // Emit wellcome message to new client
  socket.emit("message", formatMessage(botName, "Wellcome to myChat"));

  // Broadcast when a user connects
  // emits everybody (all sockets) but not the current user who emits
  // io.emit();   >> ALL the clients
  // socket.broadcast.emit(
  //   "message",
  //   formatMessage(botName, "A user has joined the channel")
  // );

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUsser(socket.id);

    // add to chat history;
    addHistory(formatMessage(user.username, msg));

    io.emit("message", formatMessage(user.username, msg));
  });

  // Runs when client dissconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat!`)
      );

      // Send all users to room with new connected user
      io.emit("roomUsers", {
        users: getUsers(),
      });
    }
  });
});
// SOCKET IO END();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
