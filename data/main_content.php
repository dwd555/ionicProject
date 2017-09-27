<?php
header("Content-type:application/json;charset=UTF-8");
require("init.php");
$sql="SELECT src FROM carousel";
$output=[];
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_all($result,MYSQLI_ASSOC);
$output['carousel']=$row;

$sql="SELECT src FROM icons";
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_all($result,MYSQLI_ASSOC);
$output['icons']=$row;
echo json_encode($output);