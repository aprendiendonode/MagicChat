<?php
$out = array();
$cmd = exec('git pull org master', $out);
echo "<ol>";
foreach($out as $x){
  echo "<li>" . $x . "</li>";
}
echo "</ol>";
?>
