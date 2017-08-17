<?php  
$host="127.0.0.1";  
$db_user="tonnywin";  
$db_pass='WO8y7Lu7xJKQIxeS';  
$db_name="db_tonnywin";  
$timezone="Asia/Shanghai";  
  
$link=mysqli_connect($host,$db_user,$db_pass);
mysqli_select_db($link,$db_name);
mysqli_query($link,"SET names UTF8");
  
header("Content-Type: text/html; charset=utf-8");
date_default_timezone_set($timezone); 

