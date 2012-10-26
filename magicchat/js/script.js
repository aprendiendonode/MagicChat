
var n = prompt("Tu nombre", "");

var sonidito = document.createElement('audio');
	sonidito.src = "http://soundjax.com/reddo/27947%5EBells.mp3";
	//sonidito.src = "nokia.mp3";

var winFocus = 'si';
window.onblur = function () {
	winFocus = 'no';
};
window.onfocus = function () {
	winFocus = 'si';
};

if (n == null || n == ""){
	var aleatorio = Math.random() * 10000;
	n = 'Anonimo' + aleatorio.toFixed();
}

	var socket = io.connect('http://adsearch.mx:6546');

	socket.emit('entro', n);
	socket.on('usuarioexiste', function(user){
		var usuario = prompt("El usuario ya existe, elige otro nombre", "");
		if (usuario == null || usuario == ""){
			var aleatorio = Math.random() * 10000;
			usuario = 'Anonimo' + aleatorio.toFixed();
		}
		socket.emit('entro', usuario);
		n = usuario;
	});

	socket.on('enviando', function(e){

			var user = e;

			var comando = user.texto.split('::');
			var msgg = 'si';
			switch(comando[0]){
				case '$alert':
					$alert(comando[1], user.nombre + ' dice:');
					msgg = no;
					break;
				case '$sonidito':
					sonidito.play();
					$('#logs').append('<article class="blue"><strong>' + user.nombre + '</strong><span>está siendo molesto e.e</span></article>');
					msgg = 'no';
					break;
				case '$redir':
					window.location.href = comando[1];
					user.texto = "Adios!!";
					break;
				case '$reload':
					window.location.reload();
					user.texto = "Recargando...";
					break;
				case '$img':
					user.texto = '<img src="' + comando[1] + '" />';
					break;
				case '$youtube':
					user.texto = '<iframe width="350" height="200" src="http://www.youtube.com/embed/' + comando[1] + '" frameborder="0" allowfullscreen></iframe>';
					break;
				case '$clear':
					$('#logs').html('');
					$('#logs').append('<article class="blue"><strong>' + user.nombre + '</strong><span>ha limpiado el historial del chat</span></article>');
					msgg = 'no';
					break;
				case '$url':
					user.texto = '<a href="' + comando[1] + '" target="_blank">' + comando[1] + '</a>';
					break;
			}

			// Emoticones
			user.texto = user.texto
				.replace(/\.i\./g, '<span class="emoticon pene" title=".i."></span>')
				.replace(/\.I\./g, '<span class="emoticon pene" title=".i."></span>')
				.replace(/\¬\¬/g, '<span class="emoticon mueca" title="¬¬"></span>')
				.replace(/\;\)/g, '<span class="emoticon guinio" title=";)"></span>')
				.replace(/\:D/g, '<span class="emoticon riendo" title=":D"></span>')
				.replace(/\:O/g, '<span class="emoticon wow" title=":O"></span>')
				.replace(/\:o/g, '<span class="emoticon wow" title=":O"></span>')
				.replace(/XD/g, '<span class="emoticon xd" title="XD"></span>')
				.replace(/\:\)/g, '<span class="emoticon sonriendo" title=":)"></span>')
				.replace(/\:P/g, '<span class="emoticon lengua" title=":P"></span>');

			user.texto = user.texto
				.replace(/\[code+\]/g, '<pre>')
				.replace(/\[\/code\]/g, '</pre>')
				.replace(/\[\[/g, '<code>')
				.replace(/\]\]/g, '</code>');

			if(msgg == 'si'){
				$('#logs').append('<article class="msg"><strong>' + user.nombre + '</strong><span>' + user.texto + '</span></article>');
			}

			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );

			if (winFocus == 'no'){
				sonidito.play();
			}
	});

	socket.on('entro', function(user){
			$('#logs').append('<article class="green"><strong>' + user.nombre + '</strong><span>se ha unido al chat</span></article>');
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );
	});

	socket.on('salio', function(user){
			$('#logs').append('<article class="red"><strong>' + user + '</strong><span>ha dejado el chat</span></article>');
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );
	});

	socket.on('online', function(user) {
		$('#online').html('');
		$.each(user, function(key, value) {
			$('#online').append('<li>' + value.nombre  + '</li>');
		});
		var nOnline = $('#online li').length;
		$('#nOnline').html(nOnline);
	});

	socket.on('escribiendo', function(res){
		if ( res.writing == 'si'){
			$('#action').html('<strong>' + res.user + '</strong><span> está escribiendo...</span>');
		}else{
			$('#action').html('');
		}
	});
	function enviar (e) {
		var texto = $('#mensaje').val();
		var limpiarspaces = texto.replace(/ /g, '').replace(/\n/g, '');
		if (limpiarspaces == ''){
			$('#logs').append('<article class="red">Debes escribir algo antes de enviarlo</span></article>');
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );
		}else{
			var user = {
				nombre: n,
				texto: texto
			}
			socket.emit('enviar', user);
		}
		$('#mensaje').val('');
		$('#action').html('');
	}


function resize (){
	var winHeight = $(window).height() - $('#hed').height();
	$('#contenedor').height(winHeight);
	var hisHeigt = winHeight - $('#formulario').height() - 90;
	$('#history').height(hisHeigt);	
	if( $(window).width() < 767){
		$('#online').hide();
	}else{
		$('#online').show();
	}
	displayUsers = 0;
}

var displayUsers = 0;
function showHideUsers(){
	if( $(window).width() < 767){
		if(displayUsers == 1){
			$('#online').hide();
			displayUsers = 0;
		}else{
			$('#online').show();
			displayUsers = 1;
		}
	}
}

function run () {
	resize();
	$(window).resize(resize);
	$('aside').click(showHideUsers);

	// make code pretty
    window.prettyPrint && prettyPrint();

    $('#mensaje').focus();
	$('#formulario').submit(function(e){
		e.preventDefault();
		enviar();
	});
	$('#mensaje').keyup(function(e){
		var enter = e.keyCode;
		if (enter == '13'){
			$('#formulario').trigger('submit');
		}
	});
	$('#mensaje').keydown(function(e){
		var writing = 'no';
		if ($('#mensaje').val() != "") {
			writing = 'si';
		}
		var who = {
			user: n,
			writing: writing
		}
		socket.emit('escribiendo', who);
	});

}
$(document).ready(run);