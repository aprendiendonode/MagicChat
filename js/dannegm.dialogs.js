// Funciones utiles
(function(dannegm) {
	// Alertas y confirmaciones, solo dispoble con jQuery
	dannegm.popup = function(title, msg, type, options, callback) {
			$('#msgWrap, #msgStyle').remove();
			$('body').append(
				'<div id="msgWrap">' +
					'<div id="msgShadow">' +
						'<div id="msgBox" class="msgDialog">' +
							'<div id="msgTitle"></div>' +
							'<div id="msgContent"><p id="msgText"></p></div>' +
							'<div id="msgOptions"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
			var mWrap = $("#msgWrap"),
				mTitle = $("#msgTitle"),
				mContent = $("#msgContent"),
				mText = $("#msgText"),
				mOptions = $("#msgOptions");

			if( title == null ){ title = document.title; }
			mTitle.text(title);

			switch( type ) {
				case 'alert':
					mText.text(msg);
					mText.html( mText.text().replace('\n', '<br />') );
					mOptions.append('<a id="msgOk" href="#">Aceptar</a>');
					$('#msgOk').click( function(e) {
						e.preventDefault();
						$('#msgWrap, #msgStyle').remove();
						if( callback ){ callback(true); }
					}).focus();
					$(document).keyup( function(e) {
						switch( e.keyCode ){
							case 13: $('#msgOk').trigger('click'); break;
							case 27: $('#msgOk').trigger('click'); break;
						}
					});
				break;
				case 'confirm':
					mText.text(msg);
					mText.html( mText.text().replace('\n', '<br />') );
					mOptions.append('<a id="msgOk" href="#">Aceptar</a><a id="msgCancel" href="#">Cancelar</a>');
					$('#msgOk').click( function(e) {
						e.preventDefault();
						$('#msgWrap, #msgStyle').remove();
						if( callback ){ callback(true); }
					}).focus();
					$('#msgCancel').click( function(e) {
						e.preventDefault();
						$('#msgWrap, #msgStyle').remove();
						if( callback ){ callback(false); }
					});
					$(document).keyup( function(e) {
						switch( e.keyCode ){
							case 13: $('#msgOk').trigger('click'); break;
							case 27: $('#msgCancel').trigger('click'); break;
						}
					});
				break;
				case 'dialog':
					mContent.html(msg);
					for ( b = 0; b < options.length; ++b){
						var label = options[b].label,
							typee = options[b].type,
							action = options[b].action;

						var optHref = '#';
						if (typee == 'link'){
							optHref = action;
						}
						mOptions.append('<a id="msgOpt' + b + '" class="msgOtpBtn" href="' + action + '" target="_blank">' + label + '</a>');
						switch (typee){
							case 'link':
								$('#msgOpt' + b).click( function(e) {
									$('#msgWrap, #msgStyle').remove();
								});
							break;
							case 'funct':
								$exec =  function(e){
									e.preventDefault();
									$('#msgWrap, #msgStyle').remove();
									if (action) { action(e); }
								};
								$('#msgOpt' + b).unbind('click', $exec).bind('click', $exec);
							break;
							case 'event':
								switch (action){
									case 'close':
										$('#msgOpt' + b).click( function(e) {
											e.preventDefault();
											$('#msgWrap, #msgStyle').remove();
										});
									break;
								}
							break;
						}
					}
					$(document).keyup( function(e) {
						switch( e.keyCode ){
							case 27: $('#msgWrap, #msgStyle').remove(); break;
						}
					});
				break;
			}

			var wrapTop = ($(window).height() - $('#msgWrap').height()) / 2;
			wrapTop = Math.round( wrapTop * 100 ) / 100;
			mWrap.css({
				'top': wrapTop + 'px'
			});
			mWrap.fadeIn();
	},

	// Accesos rapidos
	$alert = function(message, title, callback){
		dannegm.popup(title, message, 'alert', null, callback);
	},
	$confirm = function(message, title, callback){
		dannegm.popup(title, message, 'confirm', null, callback);
	},
	$dialog = function(message, title, options){
		dannegm.popup(title, message, 'dialog', options, null);
	},
	window.dannegm = dannegm;
})(window);