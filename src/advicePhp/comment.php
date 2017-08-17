<?php
include_once("connect.php");

$user = htmlspecialchars(trim($_POST['user']));
$txt = htmlspecialchars(trim($_POST['txt']));
if(empty($user)){
    $data = array('code'=>355,'message'=>"昵称不能为空！");
    echo json_encode($data);
    exit;
}
if(empty($txt)){
    $data = array('code'=>356,'message'=>"内容不能为空");
    echo json_encode($data);
    exit;
}
$time = date("Y-m-d H:i:s");
$query=mysqli_query($link,"insert into comments(user,comment,addtime)values('$user','$txt','$time')");
if($query)  {
    $data = array('code'=>1,'message'=>'success','user'=>$user,'txt'=>$txt);
    echo json_encode($data);
}