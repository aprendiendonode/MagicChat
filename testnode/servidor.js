var lucho = require('socket.io').listen(2342);

var contenido;

function recibir (res) {
	contenido = res;
	console.log('Recii: ' + res);
	enviarsss();
}
function enviarsss () {
	lucho.sockets.emit('enviando', contenido);
	console.log('Envie: ' + contenido);
}
function iniciar (juancho) {
	juancho.on('enviar', recibir);
}

lucho.sockets.on('connection', iniciar);