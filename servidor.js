var servidor = require('socket.io').listen(7873);
servidor.set('log level', 0);

var user = {}, usuarios = {};

servidor.sockets.on('connection', function(socket){

	var iden = socket.id;

	socket.on('entro', function(user){
		var u = user.name;
		user = {
			nombre: user.name,
			fbID: user.id,
			iden: iden,
			foto: "https://graph.facebook.com/" + user.id + "/picture",
			perfil: user.link
		}
		socket.username = n;
		usuarios[n] = user;
		var envTU = {
			nombre: n,
			iden: socket.id,
		};
		servidor.sockets.socket(socket.id).emit('entraste', envTU);
		servidor.sockets.emit('entro', user);
		servidor.sockets.emit('online', usuarios);
		console.log('Entro: ' + n);
	});

	socket.on('winFocus', function(e) {
		servidor.sockets.emit('winFocus', e);
	});

	socket.on('visto', function(e) {
		servidor.sockets.emit('visto', e);
	});

	socket.on('disconnect', function () {
		delete usuarios[socket.username];
		servidor.sockets.emit('salio', socket.username);
		servidor.sockets.emit('online', usuarios);
		console.log('Salio: ' + socket.username);
	});

	socket.on('enviar', function (res) {
		// Ponemos un filtro "AntiDante"
		var nombre = res.nombre.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		var texto = res.texto.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		linea = {
			nombre: nombre,
			texto: texto
		}
		servidor.sockets.emit('enviando', linea);
		console.log(res.nombre + ' dice: ' + res.texto);
	});

	socket.on('escribiendo', function(res){
		servidor.sockets.emit('escribiendo', res);
	});

	socket.on('privado', function(privado){
		if(typeof usuarios[privado.para] != "undefined"){
			servidor.sockets.socket(usuarios[privado.para].iden).emit('privado', privado);
			console.log('DM de ' + privado.de + ' para ' + privado.para + ': ' + privado.texto);
		}
	});
});