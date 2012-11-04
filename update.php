<?php
$out = array();
$cmd = exec('sh updategit.sh', $out);
echo "<ol>";
for($i = 0; $i < count($out); $i++){
	echo "<li>" . $out[$i] . "</li>";
}
echo "</ol>";
?>
