
// Creamos el servidor
var servidor = require('socket.io').listen(6546);

// Creamos un usuario anonimo
var user = {
	nombre: 'AnÃ³nimo',
	iden: 'undefined'
};

var usuarios = {};
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

		// Ponemos nombre a la session
		socket.username = n;

		// Guardamos en nuestro arreglo el objeto
		usuarios[n] = user;

		// Enviamos ese usuario diciendo que acaba de entrar
		servidor.sockets.emit('entro', user);

		// Enviamos la lista de objetos
		servidor.sockets.emit('online', usuarios);

		// El administrador debe saber quien entro
		console.log('Entro: ' + n);
	});

	// Detectamos que sale un usuario
	socket.on('disconnect', function () {

		// Borramos su objeto de la lista de usuarios
		delete usuarios[socket.username];

		// Decimos al cliente que usuario salio
		servidor.sockets.emit('salio', socket.username);

		// Actualizamos la lista en el cliente
		servidor.sockets.emit('online', usuarios);

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

	// Vemos si alguien estÃ¡ escribiendo
	socket.on('escribiendo', function(res){
		servidor.sockets.emit('escribiendo', res);
	});
});