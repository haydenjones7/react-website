var server = require("http").createServer();

var options = {
  cors: true,
};

var io = require("socket.io")(server, options);

io.sockets.on("connection", function (socket) {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`User with ID: ${data.username} joined room: ${data.room}`);
    
    const newPlayerData = {
      username: data.username,
      points: 0,
    };
    
    socket.to(data.room).emit("new_player", newPlayerData);
    console.log("NEW PLAYER");    
  });
  
  
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    // socket.to(data.room).emit("hello", "hi"); (this worked)
  });
  
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  
  socket.on("send_prompt", (data) => {
    socket.to(data.room).emit("receive_prompt", data);
    console.log("PROMPT SENT");
    console.log(data);
    // socket.to(data.room).emit("hello", "hi"); (this worked)
  });
  
  socket.on("send_answer", (data) => {
    // this might not work
    socket.to(data.room).emit("receive_answer", data);
    socket.to(data.room).emit("player_receive_answer", data);
    console.log("SEND_ANSWER");
    console.log(data);
    // socket.to(data.room).emit("hello", "hi"); (this worked)
  });
  
  socket.on("end_game", (data) => {
    socket.to(data).emit("game_over", data);
    console.log("GAME OVER");
    // socket.to(data.room).emit("hello", "hi"); (this worked)
  });
  
  // for voting:
    // receive send_gold message: send gold message and the answer?
    // and then maybe the client keeps track of/adds up all the points?
  
  socket.on("start_voting", (data) => {
    console.log("START VOTING");
    socket.to(data.room).emit("receive_all_answers", data.answers);
  });
  
  socket.on("send_gold", (data) => {
    console.log("gold vote for: ", data);
    socket.to(data.room).emit("gold", data);
  });
  socket.on("send_silver", (data) => {
    console.log("silver vote for: ", data);
    socket.to(data.room).emit("silver", data);
  });
  socket.on("send_bronze", (data) => {
    console.log("bronze vote for: ", data);
    socket.to(data.room).emit("bronze", data);
  });
  
  socket.on("send_gold_image", (data) => {
    console.log("gold image vote for: ", data);
    socket.to(data.room).emit("gold_image", data);
  });
  socket.on("send_silver_image", (data) => {
    console.log("silver image vote for: ", data);
    socket.to(data.room).emit("silver_image", data);
  });
  socket.on("send_bronze_image", (data) => {
    console.log("bronze image vote for: ", data);
    socket.to(data.room).emit("bronze_image", data);
  });
  
  socket.on("sending_drawing", (data) => {
    console.log("emitting receive_image with picture to startPTR");
    console.log(data);
    socket.to(data.room).emit("receive_image", data);
    socket.to(data.room).emit("done_with_image", data.author);
  });
  socket.on("send_image_answer", (data) => {
    console.log("emitting receive_image");
    socket.to(data.room).emit("receive_image", data);
  });
  
  socket.on("send_title", (data) => {
    console.log("sent title", data);
    socket.to(data.room).emit("title", data);
  })
  
  socket.on("send_type", (data) => {
    console.log("sent type", data);
    socket.to(data.room).emit("type", data.type);
  })
    
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});