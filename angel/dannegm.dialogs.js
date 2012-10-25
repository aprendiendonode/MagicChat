// Funciones utiles
(function(dannegm) {
	// Alertas y confirmaciones, solo dispoble con jQuery
	dannegm.popup = function(title, msg, type, options, callback) {
			$('#msgWrap, #msgStyle').remove();
			$('body').append(
				'<style id="msgStyle">' +
					'#msgWrap { display: none; position: absolute; position: fixed; top: 100px; left: 0; right: 0; overflow: hidden; } #msgShadow { width: 500px; margin: auto; padding: 10px; background: rgb(40,40,40); background: rgba(0,0,0,.7); border-radius: 10px; overflow: hidden; } #msgBox { overflow: hidden; border-radius: 7px; box-shadow: 0 0 5px #000; } #msgTitle { display: block; overflow: hidden; background: rgb(31,73,125); padding: 10px; font: 18px sans-serif; color: #fff; text-shadow: 1px 1px rgba(0,0,0,.7); border-radius: 7px 7px 0 0; } #msgContent { color: #444; display: block; overflow: hidden; font: 14px/1.4 sans-serif; padding: 10px; background: #fff; } #msgOptions { display: block; overflow: hidden; background: rgb(217,217,217) !important; border-radius: 0 0 7px 7px; padding: 5px; } #msgOptions a { text-decoration: none; color: #000; font: 12px sans-serif; display: block; float: right; margin: 5px; padding: 5px 7px; border: 1px solid rgb(127,127,127); background: #eee; background: -webkit-linear-gradient(top, rgb(242,242,242) 0%,rgb(217,217,217) 100%); border-radius: 3px; } #msgOptions a:focus { outline: none; box-shadow: 0 0 3px rgb(38,125,230); } #msgOptions a:hover { background: #fff; background: -webkit-linear-gradient(top, rgb(255,255,255) 0%,rgb(242,242,242) 100%); } #msgOptions a:active { background: rgb(242,242,242); }' +
				'</style>' +
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

			mWrap.css({
				'top': ( ($(window).height() /3) - (mWrap.height() /3) ) + 'px'
			});

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