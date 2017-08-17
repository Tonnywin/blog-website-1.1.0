<?php  
$host="bdm299714670.my3w.com";  
$db_user="bdm299714670";  
$db_pass='ab1314xx';  
$db_name="bdm299714670_db";  
$timezone="Asia/Shanghai";  
  
$link=mysqli_connect($host,$db_user,$db_pass);
mysqli_select_db($link,$db_name);
mysqli_query($link,"SET names UTF8");
  
header("Content-Type: text/html; charset=utf-8");
date_default_timezone_set($timezone); 

