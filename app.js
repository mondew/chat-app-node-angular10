let express = require('express')
let app = express();
let http = require('http');
var path = require('path');

const port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var debug = require('debug')('angular2-nodejs:server');

app.use(express.static(__dirname + 'index.html'));
// console.log(__dirname + '\dist\chat-app')
// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname + '\dist\chat-app\index.html'));
//   });
// app.set('/*', path.join(__dirname, 'index.html'));
// app.set('view engine', 'hbs');

io.on('connection',(socket)=>{
    console.log('new connection made.');
    socket.on('join', function(data){
      //joining
      socket.join(data.room);
      console.log(data.user + 'joined the room : ' + data.room);
      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
    });
    socket.on('leave', function(data){
      console.log(data.user + 'left the room : ' + data.room);
      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});
      socket.leave(data.room);
    });
    socket.on('message',function(data){
      io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
server.on('listening', onListening);
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }