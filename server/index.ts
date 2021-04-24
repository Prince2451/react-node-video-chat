import * as express from "express";
import { join } from "path";
import { sendReactApp } from "./controllers";
import { Server } from "socket.io";

const app = express();

app.use(express.static(join(__dirname, "..", "build")));
console.log(join(__dirname, "..", "build"));


app.get("/", sendReactApp);

const httpServer = app.listen(process.env.PORT || 8080);

const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
    allowedHeaders: "*",
  },
});

io.sockets.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("offer", (offer, room) => {
    socket.broadcast.to(room).emit("offer", offer);
  });
  socket.on("answer", (answer, room) => {
    socket.broadcast.to(room).emit("answer", answer);
  });
  socket.on("candidate", (candidate, room) => {
    socket.broadcast.to(room).emit("candidate", candidate);
  });
  socket.on("answer-accepted", (room) => {
    socket.broadcast.to(room).emit("answer-accepted");
  });
});
