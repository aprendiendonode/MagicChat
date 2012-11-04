<?php
$cmd = exec('sh updategit.sh');
echo "Auto pull\n";
if ($cmd){
	echo "Pull exitoso";
}else{
	echo "No se pudo hacer pull";
}
?>