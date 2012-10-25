var servidor = require('socket.io').listen(6546);

var user = {
	nombre: 'Anónimo',
	iden: 'undefined'
};

// Inicia conexion
servidor.sockets.on('connection', function(socket){
	var iden = socket.id;
	// Entro un nuevo usuario
	socket.on('entro', function(n){
		user = {
			nombre: n,
			iden: iden
		}
		servidor.sockets.emit('entro', user);
		console.log('Entro: ' + n);
	});
	// Salio un usuario
	socket.on('disconnect', function () {
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