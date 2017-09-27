<?php
header("Content-type:application;charset=utf-8");
@$id=$_REQUEST['id'] or die("{'msg':'id required'}");
@$phone=$_REQUEST['phone'] or die("{'msg':'phone required'}");
require('init.php');
$sql="SELECT * FROM books WHERE bid='$id'";
$result=mysqli_query($conn,$sql);
$list=mysqli_fetch_assoc($result);
$sql="SELECT address FROM person_detail WHERE phone='$phone'";
$result1=mysqli_query($conn,$sql);
$list1=mysqli_fetch_assoc($result1);
$list2=array_merge($list,$list1);
echo json_encode($list2);