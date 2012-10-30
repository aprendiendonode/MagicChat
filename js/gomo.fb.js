/*
Power By Gomosoft
Modificaciones para éste proyecto por Dannegm
*/
(function($){ 
	var boton, on = false, filtro = 0, user, call, access_token, user_id;
	this.ini =  function(vars){
		return chkLogin(fbIni());
	};
	this.isOn = function(){ 
		return on; 
	}; 
	this.obtAcToken = function(){ 
		return access_token; 
	}
	this.obtUserId = function(){ 
		return user_id; 
	}
	this.chkLogin =  function (resp) {
		if(filtro > 0) 
			return;
		if (resp.authResponse) {
			access_token = resp.authResponse.accessToken;
			user_id = resp.authResponse.userID;
			on = true;
		} else {
			on = false; 
			actBot("Conectar"); 
			boton.click(function() {
				FB.login(function(resp) {
					if (resp.authResponse) {
						on = true; 
						access_token = resp.authResponse.accessToken;
						user_id = resp.authResponse.userID;
						location.reload(); 
					} else {
						return {cod:11,estado:"sin permisos"};
					}
				}, 'email,user_about_me,user_hometown,user_interests,user_location');
			}); 
		}
		if(call) 
			call();
			filtro++;
	}; 
	this.fbInfo = function(callback){
		if(!on) 
			return;
		FB.api('/me', callback);
	}; 
	this.fql = function(query,callback){
		FB.api({ 
			method: 'fql.query', 
			query: query 
		}, callback );
	}; 
	this.actUser = function(user){
		user = user;
	}; 
	this.fbIni = function() {
		FB.init({
			appId: '125054150878675', 
			status: true,
			cookie: true,
			xfbml: true,
			oauth: true
		});
		FB.getLoginStatus( chkLogin ); 
		FB.Event.subscribe( 'auth.statusChange', chkLogin );
		return this;
	};
	jQuery.fn.fb = function(callback){
		boton = $(this); 
		if(callback) 
			call = callback;
			return fbIni();
	};
})(jQuery);