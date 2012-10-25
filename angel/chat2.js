var servidor = require('socket.io').listen(6546);

var user = {
	nombre: 'Anónimo',
	iden: 'undefined'
};
var usuarios = {};

// Inicia conexion
servidor.sockets.on('connection', function(socket){
	var iden = socket.id;
	// Entro un nuevo usuario
	socket.on('entro', function(n){
		user = {
			nombre: n,
			iden: iden
		}
		socket.username = n;
		// Guardamos en nuestro arreglo el objeto
		usuarios[n] = user;
		servidor.sockets.emit('entro', user);
		// Enviamos la lista de objetos
		servidor.sockets.emit('online', usuarios);
		console.log('Entro: ' + n);
	});
	// Salio un usuario
	socket.on('disconnect', function () {
		// Borramos su objeto de la lista de usuarios
		delete usuarios[socket.username];
		// Actualizamos los usuarios
		servidor.sockets.emit('online', usuarios);
		servidor.sockets.emit('salio', user);
		console.log('Salio: ' + user.nombre);
	});
	// Recibimos una linea
	socket.on('enviar', function (res) {
		var nombre = res.nombre.replace('<', '&lt;').replace('>', '&gt;');
		var texto = res.texto.replace('<', '&lt;').replace('>', '&gt;');
		linea = {
			nombre: nombre,
			texto: texto
		}
		// Enviamos la linea de vuelta
		servidor.sockets.emit('enviando', linea);
		console.log(res.nombre + ' dice: ' + res.texto);
	});
});