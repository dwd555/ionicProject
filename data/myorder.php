<?php
header("Content-type:application/json;charset=UTF-8");
//@$uid=$_REQUEST['uid'] or die('{"msg":"uid required"}');
@$phone=$_REQUEST['phone'] or die('{"msg":"phone required"}');
require("init.php");
//$sql="select books.img_sm,books.name,book_order.count,book_order.single_price FROM books,book_order WHERE book_order.bid=books.bid AND book_order.uid='$uid'";
$sql="select books.img_sm,books.name,book_order.count,book_order.single_price FROM books,book_order WHERE book_order.bid=books.bid AND book_order.phone='$phone'";
$result=mysqli_query($conn,$sql);
if($result===false){
    echo '{"msg":"err"}';
}else{
    $row=mysqli_fetch_all($result,MYSQLI_ASSOC);
    if($row==null){
        echo '{"msg":"err"}';
    }else{
        echo json_encode($row);
    }
}