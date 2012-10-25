// Creamos el servidor
var servidor = require('socket.io').listen(6546);

// Creamos un usuario anonimo
var user = {
	nombre: 'Anónimo',
	iden: 'undefined'
};

// Inicia conexion
servidor.sockets.on('connection', function(socket){

	// Obtenemos id de la session
	var iden = socket.id;

	// Detectams que entra un usuario
	socket.on('entro', function(n){

		// Obtenemos el nombre del usuario por callback
		// Creamos un usuario
		user = {
			nombre: n,
			iden: iden
		}

		// Enviamos ese usuario diciendo que acaba de entrar
		servidor.sockets.emit('entro', user);

		// El administrador debe saber quien entro
		console.log('Entro: ' + n);
	});

	// Detectamos que sale un usuario
	socket.on('disconnect', function () {

		// Decimos al cliente que usuario salio
		servidor.sockets.emit('salio', user);

		// El adminitrador igual debe saber quien salio
		console.log('Salio: ' + user.nombre);
	});

	// Recibimos los mensajes
	socket.on('enviar', function (res) {

		// Ponemos un filtro "AntiDante"
		var nombre = res.nombre.replace('<', '&lt;').replace('>', '&gt;');
		var texto = res.texto.replace('<', '&lt;').replace('>', '&gt;');

		// Hacemos un nuevo objeto con los filtros aplicados
		linea = {
			nombre: nombre,
			texto: texto
		}

		// Enviamos el objeto al cliente
		servidor.sockets.emit('enviando', linea);

		// El administrador es un dios!!
		console.log(res.nombre + ' dice: ' + res.texto);
	});
});