
var servidor = require('socket.io').listen(6546);

var user = {
	nombre: 'Anónimo',
	iden: 'undefined'
};

var usuarios = {};

servidor.sockets.on('connection', function(socket){

	var iden = socket.id;

	socket.on('entro', function(n){
		// Filtro AntiAngel
		n = n.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		user = {
			nombre: n,
			iden: iden
		}
		if(typeof usuarios[n] != "undefined"){
			servidor.sockets.socket(socket.id).emit('usuarioexiste', user);
		}else{
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
		}
	});

	socket.on('visto', function(e) {
		servidor.sockets.emit('visto', e);
	});

	socket.on('disconnect', function () {
		delete usuarios[socket.username];
		servidor.sockets.emit('salio', socket.username);
		servidor.sockets.emit('online', usuarios);
		console.log('Salio: ' + user.nombre);
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

	socket.on('rename', function(newname){
		newname = newname.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		user = {
			nombre: newname,
			iden: iden
		}
		delete usuarios[socket.username];
		socket.username = newname;
		usuarios[newname] = user;
		servidor.sockets.emit('online', usuarios); 
	});
});