/*
Power By Gomosoft
Modificaciones para éste proyecto por Dannegm
*/
(function($){ 
	var boton, data, on = false, filtro = 0, user, call, access_token, user_id;
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
			boton.remove();
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
						console.log("no tenemos permisos");
						return {cod:11,estado:"sin permisos"};
					}
				},data.permisos);
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
			appId: data.id, 
			status: true,
			cookie: true,
			xfbml: true,
			oauth: true
		});
		FB.getLoginStatus( chkLogin ); 
		FB.Event.subscribe( 'auth.statusChange', chkLogin );
		return this;
	};
	jQuery.fn.fb = function(vars,callback){
		boton = $(this); 
		if(callback) 
			call = callback 
		else if(jQuery.isFunction(vars)) 
			call = vars;

		this.vars = { 
			id : '125054150878675', 
			secret : "111f187cae3275d438aefb66ad964fd6", 
			permisos : {
				scope:'manage_pages,email,user_birthday,status_update,publish_stream,user_likes,user_about_me,read_friendlists,user_hometown,user_interests,user_location,user_subscriptions,friends_location,friends_interests'
			}
		};
		if(vars) 
			$.extend(this.vars,vars);
			data = this.vars;
			return fbIni();
	};
})(jQuery);