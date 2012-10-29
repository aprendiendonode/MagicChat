n = prompt("Tu nombre", "");

var sonidito = document.createElement('audio');
	sonidito.src = "http://soundjax.com/reddo/27947%5EBells.mp3";
	//sonidito.src = "nokia.mp3";

var multimedia = [];

var tu = {
	nombre: 'Anonimo',
	iden: 'undefine'
};
var txtFocus = 'no';
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

	var socket = io.connect('http://dannegm.com:7873');

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

	socket.on('entraste', function(tuRe){
		tu.nombre = tuRe.nombre;
		tu.iden = tuRe.iden;
	});

	socket.on('disconnect', function () {
		$alert('Te has desconectado del seridor, te ecomendamos recargar la aplicación.', 'Te has desconectado');
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
					plaSonidito();
					$('#logs').append('<article class="blue"><strong>' + user.nombre + '</strong><span>está siendo molesto e.e</span></article>');
					msgg = 'no';
					break;
				case '$redir':
					window.location.href = comando[1];
					user.texto = "Adios!!";
					break;
				case '$marquee':
					user.texto = '<marquee class="marquee">' + comando[1] + '</marquee>';
					break;
				case '$reload':
					plaSonidito();
					$confirm('Estan a punto de recargar el chat, ¿estás de acuerdo?','Recargando...',function(r){
						if(r){
							window.location.reload();
						}else{
							$('#logs').append('<article class="red"><span>Has cancelado la recarga</span></article>');
						}
					});
					msgg = 'no';
					break;
				case '$img':
					var mediaa = {
						typo: 'img',
						author: user.nombre,
						date: hora(),
						content: comando[1]
					};
					multimedia.push(mediaa);
					user.texto = '<figure class="media_img"><div><img src="' + comando[1] + '" /></div></figure>';
					break;
				case '$youtube':
					var mediaa = {
						typo: 'youtube',
						author: user.nombre,
						date: hora(),
						content: comando[1]
					};
					multimedia.push(mediaa);
					user.texto = '<figure class="media_youtube"><iframe src="http://www.youtube.com/embed/' + comando[1] + '" frameborder="0" allowfullscreen></iframe></figure>';
					break;
				case '$url':
					user.texto = '<a href="' + comando[1] + '" target="_blank">' + comando[1] + '</a>';
					break;
				case '$borrarchat':
					$('#logs').html('');
					$('#logs').append('<article class="blue"><strong>' + user.nombre + '</strong><span>ha limpiado el historial del chat</span></article>');
					msgg = 'no';
					break;
			}

			// Emoticones
			user.texto = user.texto
				.replace(/\.i\./g, '<span class="emoticon pene" title=".i."></span>')
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

			user.texto = user.texto
				.replace(/\[code+\]/g, '<pre>')
				.replace(/\[\/code\]/g, '</pre>')
				.replace(/\[\[/g, '<code>')
				.replace(/\]\]/g, '</code>');

			if(msgg == 'si'){
				$('#logs').append('<article class="msg"><span class="time">' + hora() + '</span><strong>' + user.nombre + '</strong><span>' + user.texto + '</span></article>');
			}

			autoScroll();

			if (winFocus == 'no'){
				plaSonidito();
			}

			if (txtFocus == 'si'){
				socket.emit('visto', {visto: 'si', iden: user.nombre});
			}else{
				socket.emit('visto', {visto: 'no', iden: user.nombre});
			}
	});

	socket.on('visto', function(visto){
		if (visto.iden != tu.nombre){
			if (visto.visto == 'si'){
				$('#action').html('<span>Visto</span>');
				$('[rel="user_' + visto.iden + '"] .actionUser').html('lo vió');
			}else{
				$('#action').html('');
				$('[rel="user_' + visto.iden + '"] .actionUser').html('');
			}
		}
	});

	socket.on('entro', function(user){
			$('#logs').append('<article class="green"><span class="time">' + hora() + '</span><strong>' + user.nombre + '</strong><span>se ha unido al chat</span></article>');
			autoScroll();
	});

	socket.on('salio', function(user){
			$('#logs').append('<article class="red"><span class="time">' + hora() + '</span><strong>' + user + '</strong><span>ha dejado el chat</span></article>');
			autoScroll();
	});

	socket.on('winFocus', function(w){
		if(w.focused == 'no'){
			$('[rel="user_' + w.iden + '"]').addClass('naranjita');
		}else{
			$('[rel="user_' + w.iden + '"]').removeClass('naranjita');
		}
	});

	socket.on('online', function(user) {
		$('#online').html('');
		$.each(user, function(key, value) {
			var eresTu = '';
			if (value.nombre == tu.nombre){
				eresTu = 'id="tu"';
			}
			$('#online').append('<li rel="user_' + value.nombre + '" ' + eresTu + '>' + value.nombre  + '<span class="actionUser"></span></li>');
		});
		var nOnline = $('#online li').length;
		$('#nOnline').html(nOnline);
	});
	socket.on('rename',function(newname){
		if ( newname.error == 'username exist'){
			if (newname.last == tu.nombre){
				$alert('Ese nombre está siendo ocupado por otro usuario');
			}
		}else{
			$('#logs').append('<article class="blue"><span class="time">' + hora() + '</span><span><strong>' + newname.last + '</strong> se ha cambiado el nombre a <strong>' + newname.now + '</strong></span></article>');
			autoScroll();
		}
	});

	socket.on('escribiendo', function(res){
		if ( res.writing == 'si'){
			$('#action').html('Escribiendo...</span>');
			$('[rel="user_' + res.user + '"] .actionUser').html('está escribiendo');
		}else{
			$('#action').html('');
			$('[rel="user_' + res.user + '"] .actionUser').html('');
		}
	});

	socket.on('privado', function(privado){
		$('#logs').append('<article class="msg"><span class="time">' + hora() + '</span><strong>De ' + privado.de + ' para ' + privado.para + '</strong><span><pre>' + privado.texto + '</pre></span></article>');
		autoScroll();
	});

	function enviar (e) {
		var texto = $('#mensaje').val();
		var limpiarspaces = texto.replace(/ /g, '').replace(/\n/g, '');

		var comando = texto.split('::');
		var msgg = 'si';
		switch(comando[0]){
			case '$clear':
				$('#logs').html('');
				$('#logs').append('<article class="blue"><span>Has limpiado tu historial del chat</span></article>');
				autoScroll();
				msgg = 'no';
				break;
			case '$rename':
				tu.nombre = comando[1];
				socket.emit('rename', comando[1]);
				msgg = 'no';
				break;
			case '$privado':
				var privado = {
					de: tu.nombre,
					para: comando[1],
					texto: comando[2]
				}
				socket.emit('privado', privado);
				$('#logs').append('<article class="msg"><span class="time">' + hora() + '</span><strong>De ' + privado.de + ' para ' + privado.para + '</strong><span><pre>' + privado.texto + '</pre></span></article>');
				autoScroll();
				msgg = 'no';
				break;
		}
		if (msgg == 'si'){
			if (limpiarspaces == ''){
				$('#logs').append('<article class="red"><span>Debes escribir algo antes de enviarlo</span></article>');
				autoScroll();
			}else{
				var user = {
					nombre: tu.nombre,
					texto: texto
				}
				socket.emit('enviar', user);
			}
		}
		var altodiv = $('#logs').height();
		$('#history').scrollTop( altodiv );
		$('#mensaje').val('');
		$('#action').html('');
	}


function resize (){
	var menuUsers;
	if( $(window).width() < 767){
		$('#online').hide();
		menuUsers = $('#menuUsers').height();
	}else{
		$('#online').show();
		menuUsers = 0;
	}
	displayUsers = 0;
	var winHeight = $(window).height() - $('#hed').height();
	$('#contenedor').height(winHeight);
	var hisHeigt = winHeight - $('#formulario').height() - menuUsers - 50;
	$('#history').height(hisHeigt);
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
	document.addEventListener("backbutton", function(){
		if(displayUsers == 1){
			$('#online').hide();
			displayUsers = 0;
		}else{
			window.close();
		}
	}, false);

	resize();
	$(window).resize(resize);
	$('aside').click(showHideUsers);

	$('#goChat').click(function(e){
		$('#logs').show();
		$('#media').hide();
		$('#goChat').addClass('active');
		$('#goMedia').removeClass('active');
		autoScroll();
	});
	$('#goMedia').click(function(e){
		$('#logs').hide();
		$('#media').show();
		$('#goChat').removeClass('active');
		$('#goMedia').addClass('active');

		$('#media').html('');
		for (item in multimedia){
			var itemMedia = multimedia[item];
			var contenido;
			switch(itemMedia.typo){
				case 'img': contenido = '<div><img src="' + itemMedia.content + '" /></div>'; break;
				case 'youtube': contenido = '<iframe src="http://www.youtube.com/embed/' + itemMedia.content + '" frameborder="0" allowfullscreen></iframe>'; break;
			}
			var tmp = '<figure class="media_' + itemMedia.typo + '">'
						+ contenido
						+ '<figcaption>Por <strong>' + itemMedia.author + '</strong> a las ' + itemMedia.date + '</figcaption></figure>';
			$('#media').append(tmp);
		}
		var txtMedia = $('#media').html().replace(/ /g, '').replace(/\n/g, '');
		if (txtMedia == ''){
			$('#media').append('<pre>No hay multimedia que ver, aún...</pre>');
		}

		var cSscroll = $('#cScroll').is(":checked");
		if (cSscroll){
			var altodiv = $('#media').height();
			$('#history').scrollTop( altodiv );
		}
	});

	$('li[rel]').live('click', function(){
		var liuser = $(this).attr('rel').split('_')[1];
		$('#mensaje').val('$privado::' + liuser + '::').focus();
	});

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

	$('#mensaje').keyup(function(e){
		var cleantexto = $('#mensaje').val().replace(/ /g, '').replace(/\n/g, '');
		var writing = 'no';
		if (cleantexto != '') {
			writing = 'si';
		}
		var who = {
			user: tu.nombre,
			writing: writing
		}
		socket.emit('escribiendo', who);
	});
	$('#mensaje').focus(function(){
		socket.emit('visto', {visto: 'si', iden: tu.nombre});
		txtFocus = 'si';
	});
	$('#mensaje').blur(function(){
		socket.emit('visto', {visto: 'no', iden: tu.nombre});
		txtFocus = 'no';
	});
	$(window).focus(function(){
		socket.emit('winFocus', {focused: 'si', iden: tu.nombre});
	});
	$(window).blur(function(){
		socket.emit('winFocus', {focused: 'no', iden: tu.nombre});
	});

	$('#help').click(function(e){
		e.preventDefault();
		$alert( '<article>' + $('#helpTxt').html() + '</article>', 'Ayuda' );
	});

}
$(document).ready(run);