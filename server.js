var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
var users= [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
  console.log('new connection made');


  //Show all users when first logged on 
  socket.on('get-users', function(){
    socket.emit('all-users', users);
  });

  //When new sockets join
  socket.on('join',function(data){
    console.log(data); //nickname
    console.log(users);
    socket.nickname = data.nickname;
    users[socket.nickname] = socket;
    var userObj = {
      nickname: data.nickname,
      socketid: socket.id      
    }
    users.push(userObj);
    io.emit('all-users', users);
  });

  //Broadcast the message
  socket.on('send-message', function(data){
    socket.broadcast.emit('message-recieved', data);
    //io.emit('message-received',data);
  })

  //Disconnect from socket
  socket.on('disconnect', function(){
    users = users.filter(function(item){
      return item.nickname !== socket.nickname;
    });
    io.emit('all-users',users);
  })

});

server.listen(process.env.PORT || port)

console.log(`listening on port ${port}`);