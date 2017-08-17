<?php  
include_once("connect.php");
  
$q=mysqli_query($link,"select * from zhihutopic");
while($row=mysqli_fetch_array($q)){  
        $zhihutopic[] = array('uid'=>$row['uid'],'topicname'=>$row['topicname'],'url'=>$row['url'],'imagesrc'=>$row['imagesrc']);  
}  
echo json_encode($zhihutopic);