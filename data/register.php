<?php
header("Content-Type:application/json;charset=UTF-8");
@$phone=$_REQUEST['phone'] or die('{"msg":"phone required"}');
require("init.php");
$sql="SELECT uid FROM book_user WHERE phone='$phone'";
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_assoc($result);
if($row==null){
    echo '{"msg":"succ"}';
}else{
    echo '{"msg":"err"}';
}