var lucho = require('socket.io').listen(2342);

var contenido, usuarios = [];

function recibir (res) {
	/*
	 res = {
		nombre: tal,
		texto: tal
	 }
	*/
	contenido = res;
	usuarios.push(res.nombre);
	console.log('Se conecto ' + res.nombre);
	enviarsss();
}
function enviarsss () {
	obj = {
		usuarios: usuarios,
		usuario: contenido
	}
	lucho.sockets.emit('enviando', obj);
}
function iniciar (juancho) {
	juancho.on('enviar', recibir);
	var usuarioid = lucho.sockets.id;
	console.log(usuarioid);
}

lucho.sockets.on('connection', iniciar);