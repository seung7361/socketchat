var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function (req, res) {
  res.redirect('/lobby');
});

app.get('/lobby', function (req, res) {
  res.sendFile(__dirname + '/lobby.html');
});

app.get('/chat', function (req, res) {
  console.log(req.query.id + ' connected.');
  res.sendFile(__dirname + '/chat.html')
});

io.on('connection', function (socket) {
  socket.on('init', function (data) {
    console.log('welcome, ' + data);
    fs.readFile(__dirname + '/messages.txt', function (err, data) {
      if (err) throw err;
      socket.emit('initback', data.toString());
    });
  });

  socket.on('sendmsg', function (data) {
    fs.appendFile('messages.txt', data.userid + '----' + data.msg + "\n", function (err) {
      if (err) throw err;
    });
    io.sockets.emit('msg event', data);
  });

  socket.on('disconnect', function (data) {
    console.log(data + ' disconnected.');
  });
});

http.listen(80, function () {
  console.log('listening on *:80');
});
