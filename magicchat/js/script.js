
// Antes de iniciar el chat pedimos que nos de su nombre
var n = prompt("Tu nombre", "");

//Cargamos sonidito
var sonidito = document.createElement('audio');
	sonidito.src = "http://soundjax.com/reddo/27947%5EBells.mp3";
	//sonidito.src = "nokia.mp3";

//Comprobamos si la ventana esta en foco
var winFocus = 'si';

//No esta en foco
window.onblur = function () {
	winFocus = 'no';
};

//Si esta en foco
window.onfocus = function () {
	winFocus = 'si';
};

//Si nos da su nombre continuamos
if (n){

	// Creamos el socket al servidor
	var socket = io.connect('http://adsearch.mx:6546');

	// Le decimos al servidor que ya entramos, le mandamos nuestro nombre
	socket.emit('entro', n);

	// Esto cuando alguien mas nos manda un mensaje
	socket.on('enviando', function(e){
			// Nos regresa un callback con un objeto json
			var user = e;

			// Esto es para los comandos

			var comando = user.texto.split('::');
			var msgg = 'si';
			switch(comando[0]){

				// Envia una alerta
				// $alert::foo bar
				case '$alert':
					$alert(comando[1], user.nombre + ' dice:');
					msgg = no;
					break;

				// Enviar sonidito
				// $sonidito::
				case '$sonidito':
					sonidito.play();
					msgg = 'no';
					break;
				// Nos redircciona a otra pag
				// $redir::http://foo.bar
				case '$redir':
					window.location.href = comando[1];
					user.texto = "Adios!!";
					break;
				// Recarga la pag
				// $reload::
				case '$reload':
					window.location.reload();
					user.texto = "Recargando...";
					break;
				// Insertar imagen
				// $img::path/to/img
				case '$img':
					user.texto = '<img src="' + comando[1] + '" />';
					break;
				// Iserta video de youtube
				// $youtube::iddelvideo
				case '$youtube':
					user.texto = '<iframe width="350" height="200" src="http://www.youtube.com/embed/' + comando[1] + '" frameborder="0" allowfullscreen></iframe>';
					break;
				// Limpia el historial
				// $clear::
				case '$clear':
					$('#logs').html('');
					$('#logs').append('<article class="blue"><strong>' + user.nombre + '</strong><span>ha limpiado el historial del chat</span></article>');
					msgg = 'no';
					break;
			}

			// Emoticones
			user.texto = user.texto
				.replace('.i.', '<span class="emoticon pene" title=".i."></span>')
				.replace('.I.', '<span class="emoticon pene" title=".i."></span>')
				.replace('¬¬', '<span class="emoticon mueca" title="¬¬"></span>')
				.replace(';)', '<span class="emoticon guinio" title=";)"></span>')
				.replace(':D', '<span class="emoticon riendo" title=":D"></span>')
				.replace(':O', '<span class="emoticon wow" title=":O"></span>')
				.replace(':o', '<span class="emoticon wow" title=":O"></span>')
				.replace('XD', '<span class="emoticon xd" title="XD"></span>')
				.replace(':)', '<span class="emoticon sonriendo" title=":)"></span>')
				.replace(':P', '<span class="emoticon lengua" title=":P"></span>');




			user.texto = user.texto
				.replace('[code]', '<pre class="prettyprint linenums">')
				.replace('[/code]', '</pre>');
			prettyPrint();

			// make code pretty

			// Añadimos el objeto recibido a la capa #logs donde mostraremos el chat
			if(msgg == 'si'){
				$('#logs').append('<article class="msg"><strong>' + user.nombre + '</strong><span>' + user.texto + '</span></article>');
			}

			// Esto hace un scroll automatico
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );

			// Manda sonidito si no estas poniendo atencion
			if (winFocus == 'no'){
				sonidito.play();
				//document.title = user.nombre + ' está hablando';
			}
	});

	// Revisamos si alguien acaba de entrar
	socket.on('entro', function(user){
			$('#logs').append('<article class="green"><strong>' + user.nombre + '</strong><span>se ha unido al chat</span></article>');
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );
	});

	// Revisamos si alguien salió
	socket.on('salio', function(user){
			$('#logs').append('<article class="red"><strong>' + user + '</strong><span>ha dejado el chat</span></article>');
			var altodiv = $('#logs').height();
			$('#history').scrollTop( altodiv );
	});

	// Usuarios conectados
	socket.on('online', function(user) {
		$('#online').html('');
		$.each(user, function(key, value) {
			$('#online').append('<li>' + value.nombre  + '</li>');
		});
		var nOnline = $('#online li').length;
		$('#nOnline').html(nOnline);
	});

	// vemos si esta escribiendo otro
	socket.on('escribiendo', function(res){
		if ( res.writing == 'si'){
			$('#action').html('<strong>' + res.user + '</strong><span> está escribiendo...</span>');
		}else{
			$('#action').html('');
		}
	});

	// Funcion que enia el texto al servidor
	function enviar (e) {
		var texto = $('#mensaje').val();

		// Creamos el objeto que vamos a enviar
		var user = {
			nombre: n,
			texto: texto
		}
		$('#mensaje').val('');
		$('#action').html('');

		// Enviamos el objeto
		socket.emit('enviar', user);
	}
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
	

	// Al enviar el formulario ejecutamos la funcion enviar();
	$('#formulario').submit(function(e){
		e.preventDefault();
		enviar();
	});

	// Si pulsamos enter enviamos el formulario
	$('#mensaje').keyup(function(e){
		var enter = e.keyCode;
		if (enter == '13'){
			$('#formulario').trigger('submit');
		}
	});

	// Vemos si está escribiendo
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