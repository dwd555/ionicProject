<?php
header("Content-type:application/json;charset=UTF-8");
@$pageNum=$_REQUEST['pageNum'] or die("{'msg':'pageNum required'}");
if(!$pageNum){
    $pageNum=1;
}else{
    $pageNum=intval($pageNum);
}
require('init.php');
$output=[
	'pageSize'=>5,			//每页最多显示的记录数
	'pageNum'=>$pageNum,	//当前要显示的页号
	'data'=>[]					//当前页中的记录行
];
$start=($output['pageNum']-1)*$output['pageSize'];	//从哪一行开始读取，从0开始
$count=$output['pageSize'];	//一次最多读取的记录行数
$sql="SELECT * FROM books LIMIT $start,$count";	//Mysql中的分页查询
$result=mysqli_query($conn,$sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);

echo json_encode($output);