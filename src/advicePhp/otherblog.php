<?php  
include_once("connect.php");
  
$q=mysqli_query($link,"select * from otherblog");
while($row=mysqli_fetch_array($q)){  
        $otherblog[] = array('uid'=>$row['uid'],'blogname'=>$row['blogname'],'url'=>$row['url'],'imagesrc'=>$row['imagesrc']);  
}  
echo json_encode($otherblog);