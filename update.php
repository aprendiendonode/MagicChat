<?php
$out = array();
$cmd = exec('sh updategit.sh', $out);
if ($cmd){
	echo "Pull exitoso<br>";
	echo $out;
}else{
	echo "No se pudo hacer pull";
}
?>