<?php
$out = array();
$cmd = exec('git pull origin master', $out);
if ($cmd){
	echo "Pull exitoso<br>";
	echo end($out);
}else{
	echo "No se pudo hacer pull";
}
?>