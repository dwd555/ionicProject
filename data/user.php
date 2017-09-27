<?php
header("Content-Type:application/json;charset=utf-8");
@$phone=$_REQUEST['phone'] or die('{"msg":"phone required"}');
@$pwd=$_REQUEST['pwd'] or die('{"msg":"pwd required"}');
require('init.php');
$sql="INSERT INTO book_user VALUES('NULL','$phone','$pwd')";
$result=mysqli_query($conn,$sql);
if($result===false){
    echo '{"msg":"err"}';
}else{
    echo '{"msg":"succ"}';
}
$sql="INSERT INTO person_detail VALUES('NULL','$phone','NULL','NULL','NULL','NULL')";
$result=mysqli_query($conn,$sql);