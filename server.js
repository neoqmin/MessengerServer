var status = require('connect-server-status');
var http = require('http');
var app = require('express')();

var httpServer = http.createServer(app).listen(process.env.PORT || 8080, function(req, res) {
    console.log('server started : ' + (process.env.PORT || 8080));
});

app.get('/status', status(httpServer, {
    maintenance: __dirname + '\\maintenance',
    add: {version:"0.0.1"}
}));

app.get('/', function(req, res) {
    console.log(__dirname + '\\index.html');
    res.sendFile(__dirname + '\\index.html');
});

app.get('/:filename', function(req, res) {
    console.log(__dirname + '\\' + req.params.filename);
   res.sendFile(__dirname + '\\' + req.params.filename);
});

var io = require('socket.io')(httpServer);

io.on('connection', function(socket) {
    console.log('a user connected:' + socket.msg);
    socket.emit('server message', {id:"관리자", msg:'환영합니다.'});
    socket.emit('server message', {id:"관리자", msg:'자신의 ID를 쓰고 메시지를 전송하세요.'});
    socket.on('chat message', function(msg) {
        console.log('chat message('+msg.id+') : ' + msg.msg);
        socket.broadcast.emit('server message'. msg);
        socket.emit('server message', msg);
    });
    socket.on('disconnect', function(msg) {
        console.log('disconnect');
    });
});