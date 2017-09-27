<?php
header("Content-Type:application/json;charset=UTF-8");
@$bid=$_REQUEST['bid'] or die('{"msg":"bid required"}');
@$count=$_REQUEST['count'] or die('{"msg":"count required"}');
@$address=$_REQUEST['address'] or die('{"msg":"address required"}');
@$phone=$_REQUEST['phone'] or die('{"msg":"phone required"}');
@$single_price=$_REQUEST['price'] or die('{"msg":"price required"}');
require("init.php");
$sql="INSERT INTO book_order VALUES('NULL','$bid','$count','$address','$single_price','$phone')";
$result=mysqli_query($conn,$sql);
if($result===false){
    echo '{"msg":"err"}';
}else{
    echo '{"msg":"succ"}';
}