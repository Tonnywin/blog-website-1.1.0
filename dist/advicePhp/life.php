<?php  
include_once("connect.php");
  
$q=mysqli_query($link,"select * from life");
while($row=mysqli_fetch_array($q)){  
        $life[] = array('uid'=>$row['uid'],'sourceName'=>$row['sourceName'],'sourceLink'=>$row['sourceLink'],'sourcePassword'=>$row['sourcePassword'],'addtime'=>$row['addtime']);    
}  
echo json_encode($life);