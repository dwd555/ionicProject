<?php
header("Content-Type:application/json;charset=UTF-8");
$phone=$_REQUEST['phone'] or die('{"msg":"phone required"}');
$address=$_REQUEST['address'] or die('{"msg":"address required"}');
require("init.php");
$sql="UPDATE person_detail SET address='$address' WHERE phone='$phone'";
$result=mysqli_query($conn,$sql);
if($result===false){
    echo '{"msg":"err"}';
}else{
    echo '{"msg":"succ"}';
}