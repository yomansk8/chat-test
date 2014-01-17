var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function(req, res){
	console.log('Un utilisateur a afficher la page');
	res.end('Hello World');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = {};

io.sockets.on('connection', function(socket){
	var me = false;
	console.log('Nouvel utilisateur');

	for(var i in users){
		socket.emit('newuser', users[i]);
	}


	/*  message reception */
	socket.on('newMsg', function(message){
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		io.sockets.emit('newMsg', message);
	});
 

	/* User login */
	socket.on('login', function(user){
		if(user.username != "" && user.mail != ""){
			me = user;
			me.id = user.mail.replace('@', '-').replace('.', '-');
			me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?size=50';
			socket.emit('logged');
			users[me.id] = me;
			io.sockets.emit('newuser', me);
		} else {
			socket.emit('loginerror');
		}
		
	});

	/* User logout */
	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		io.sockets.emit('userOut', me);
	})
});