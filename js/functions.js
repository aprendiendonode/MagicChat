
function hora () {
	var horas = new Date(),
		ampm = 'am',
		hours = horas.getHours(),
		minutes = horas.getMinutes();
	if (hours > 12){
		ampm = 'pm';
	}
	switch(hours){
		case 13: hours = 1; break;
		case 14: hours = 2; break;
		case 15: hours = 3; break;
		case 16: hours = 4; break;
		case 17: hours = 5; break;
		case 18: hours = 6; break;
		case 19: hours = 7; break;
		case 20: hours = 8; break;
		case 21: hours = 9; break;
		case 22: hours = 10; break;
		case 23: hours = 11; break;
		case 24: hours = 12; break;
	}
	switch(minutes){
		case 1: minutes = '01'; break;
		case 2: minutes = '02'; break;
		case 3: minutes = '03'; break;
		case 4: minutes = '04'; break;
		case 5: minutes = '05'; break;
		case 6: minutes = '06'; break;
		case 7: minutes = '07'; break;
		case 8: minutes = '08'; break;
		case 9: minutes = '09'; break;
	}
	return hours + ':' + minutes + ' ' + ampm;
}

function autoScroll(){
	var cScroll = $('#cScroll').is(":checked");
	if (cScroll){
		var altodiv = $('#logs').height();
		//$('#history').scrollTop( altodiv );
		$('#history').animate({scrollTop: altodiv});
	}
}

function plaSonidito(){
	var cSonido = $('#cSonido').is(":checked");
	if (cSonido){
		sonidito.play();
	}
}