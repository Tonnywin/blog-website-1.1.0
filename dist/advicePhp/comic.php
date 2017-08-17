<?php  
include_once("connect.php");
  
$q=mysqli_query($link,"select * from comic");
while($row=mysqli_fetch_array($q)){  
        $comic[] = array('uid'=>$row['uid'],'sourceName'=>$row['sourceName'],'sourceLink'=>$row['sourceLink'],'sourcePassword'=>$row['sourcePassword'],'addtime'=>$row['addtime']);  
}  
echo json_encode($comic);