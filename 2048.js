var documentWidth = window.screen.availWidth;
var gridContainerWidth = documentWidth*0.92;
var cellSideLength = 0.18*documentWidth;
var cellSpace = 0.04*documentWidth;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

//二维数组：记录棋盘上的数据
var dataArr = new Array();
//分数
var score = 0;

$(document).ready(function(){
	prepareForMobile();
    newgame();
});
function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	$("#panel").css('width',gridContainerWidth-2*cellSpace);
	$("#panel").css('height',gridContainerWidth-2*cellSpace);
	$("#panel").css('padding',cellSpace);
	$("#panel").css('border-radius',0.02*gridContainerWidth);

	$(".panel-cell").css('width',cellSideLength);
	$(".panel-cell").css('height',cellSideLength);
	$(".panel-cell").css('border-radius',0.02*cellSideLength);
}
function newgame(){
	//初始化棋盘
	init();
	//随机生成两个数字
	generateNumber();
	generateNumber();
}

function init(){
	//动态生成棋盘
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var panelCell = $("#panel-cell-"+i+"-"+j);
			panelCell.css("top",getPosTop(i,j));
			panelCell.css("left",getPosLeft(i,j));
		};
	};
	//初始化数组
	for (var i = 0; i < 4; i++) {
		dataArr[i] = new Array();
		for(var j = 0; j < 4; j++){
			dataArr[i][j] = 0;
		}
	}
	
	//更新视图
	updateView();
}
function getPosTop(x,y){
	return cellSpace+(cellSpace+cellSideLength)*x;
}
function getPosLeft(x,y){
	return cellSpace+(cellSpace+cellSideLength)*y;
}
function updateView(){
	$(".number-cell").remove();
	var numberCell = "",panel = $("#panel");
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			panel.append('<div id="number-cell-'+i+'-'+j+'" class="number-cell"></div>');
			numberCell = $("#number-cell-"+i+"-"+j);
			if(dataArr[i][j]==0){
				numberCell.css("width","0px");
				numberCell.css("height","0px");
				numberCell.css("top",getPosTop(i,j)+cellSideLength/2);
				numberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
			}else{
				numberCell.css("width",cellSideLength);
				numberCell.css("height",cellSideLength);
				numberCell.css("top",getPosTop(i,j));
				numberCell.css("left",getPosLeft(i,j));
				numberCell.css('background-color',getNumberBackgroundColor( dataArr[i][j] ) );
                numberCell.css('color',getNumberColor( dataArr[i][j] ) );
                numberCell.text( getNumberText( dataArr[i][j] ) );
			}
		}
	}
	$(".number-cell").css('line-height',cellSideLength+"px")
	$(".number-cell").css('font-size',0.6*cellSideLength+"px")
}
function getNumberBackgroundColor(number){
	switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }

    return "black";
}
function getNumberColor(number){
	function getNumberColor( number ){
	    if( number <= 4 )
	        return "#776e65";

	    return "white";
	}
}
function getNumberText(number){
	return number;
}
function generateNumber(){

	var positionObj = randomPosition();
	if(!positionObj){
		return false;
	}

	var randomNum = Math.random() < 0.5? 2 : 4;
	dataArr[positionObj.x][positionObj.y] = randomNum;
	showNumberWithAnimation(positionObj.x, positionObj.y, randomNum);
	return true;
}

/*function nospace(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if(dataArr[i][j]==0)
				return false;
		}
	}
	return true;
}*/

//从棋盘中随机一个位置，如果没有位置返回false,有位置返回随机位置的坐标
function randomPosition(){
	var positionArr = [], position = {};
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if(dataArr[i][j]==0){
				//记录该位置
				position.x = i;
				position.y = j;
				positionArr.push({x:i,y:j});
				// (function(obj){
				// 	positionArr.push(obj);
				// })(position);
			}
		}
	}
	var length = positionArr.length;
	if(length == 0){
		return false;
	}else{
		//从记录可用位置坐标的数组中随即一个位置
		return positionArr[parseInt(Math.floor(Math.random()*length))];
	}
}

function showNumberWithAnimation( i , j , number){
    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',getNumberBackgroundColor(number));
    numberCell.css('color',getNumberColor(number));
    numberCell.text(getNumberText(number));

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop( i , j ),
        left:getPosLeft( i , j )
    },50);
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37: //left
			event.preventDefault();
			var flag = moveLeft();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
            break;
        case 38: //up
        	event.preventDefault();
            var flag = moveTop();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
            break;
        case 39: //right
        	event.preventDefault();
            var flag = moveRight();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
            break;
        case 40: //down
        	event.preventDefault();
            var flag = moveBottom();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
            break;
        default: //default
            break;
	}
});

document.addEventListener('touchstart',function(event){
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;
	var deltax = endX - startX;
	var deltay = endY - startY;
	if(Math.abs(deltax) < 0.15*documentWidth && Math.abs(deltay) < 0.15*documentWidth){
		return;
	}
	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax > 0){
			//move right
			var flag = moveRight();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
		}else{
			//move left
			var flag = moveLeft();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
		}
	}else{
		if(deltay < 0){
			//move top
			var flag = moveTop();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
		}else{
			//move bottom
			var flag = moveBottom();
            if(flag == 0){
            	gameOver();
            }else if(flag == 1){
            	generateNumber();
            }
		}
	}
});
//可以移动返回1，格子都满了返回0，格子未满但无法移动（数字都在左边）返回2
function moveLeft(){
	var canMoveFlag = false, 
	fullflag = true,//是否格子全满
	p;//记录碰撞位置
	for(var i = 0; i < 4; i++){
		p = 0;
		for(var j = 1; j < 4; j++){
			//可以移动的条件：前一个位置是0或者前一个位置跟当showMoveAnimation();前位置数字相等
			if(dataArr[i][j] != 0){
				for(var k = p; k < j; k++){
					if(dataArr[i][k] == 0){
						showMoveAnimation(i,j,i,k);
						dataArr[i][k] = dataArr[i][j];
						dataArr[i][j] = 0;
						canMoveFlag = true;
						//位置是0,p不用改变
					}else if(dataArr[i][k] == dataArr[i][j]){
						showMoveAnimation(i,j,i,k);
						p += 1;
						dataArr[i][k] *= 2;
						dataArr[i][j] = 0;
						canMoveFlag = true;
						score += dataArr[i][k];
						updateScore(score);
					}else{
						p += 1;
					}
				}
			}else{
				fullflag = false;//有空格子
			}
		}
	}
	if(canMoveFlag){
		setTimeout("updateView()",100);
		return 1;
	}
	if(fullflag){
		return 0;
	}
	return 2;
}
function moveRight(){
	var canMoveFlag = false, 
	fullflag = true,//是否格子全满
	p;//记录碰撞位置
	for(var i = 0; i < 4; i++){
		p = 3;
		for(var j = 2; j >= 0; j--){
			//可以移动的条件：右边位置是0或者右边位置跟当前位置数字相等
			if(dataArr[i][j] != 0){
				for(k = p; k > j; k--){
					if(dataArr[i][k] == 0){
						showMoveAnimation(i,j,i,k);
						dataArr[i][k] = dataArr[i][j];
						dataArr[i][j] = 0;
						canMoveFlag = true;
					}else if(dataArr[i][k] == dataArr[i][j]){
						showMoveAnimation(i,j,i,k);
						p -= 1;
						dataArr[i][k] *= 2; 
						dataArr[i][j] = 0;
						canMoveFlag = true;
						score += dataArr[i][k];
						updateScore(score);
					}else{
						p -= 1;
					}
				}
			}else{
				fullflag = false;//有空格子
			}
		}
	}
	if(canMoveFlag){
		setTimeout("updateView()",100);
		return 1;
	}
	if(fullflag){
		return 0;
	}
	return 2;
}
function moveTop(){
	var canMoveFlag = false, 
	fullflag = true,//是否格子全满
	p;//记录碰撞位置
	for(var j = 0; j < 4; j++){
		p = 0;
		for(var i = 1; i < 4; i++){
			//可以移动的条件：前一个位置是0或者前一个位置跟当前位置数字相等
			if(dataArr[i][j] != 0){
				for(var k = p; k < i; k++){
					if(dataArr[k][j] == 0){
						showMoveAnimation(i,j,k,j);
						dataArr[k][j] = dataArr[i][j];
						dataArr[i][j] = 0;
						canMoveFlag = true;
						//位置是0,p不用改变
					}else if(dataArr[k][j] == dataArr[i][j]){
						showMoveAnimation(i,j,k,j);
						p += 1;
						dataArr[k][j] *= 2;
						dataArr[i][j] = 0;
						canMoveFlag = true;
						score += dataArr[k][j];
						updateScore(score);
					}else{
						p += 1;
					}
				}
			}else{
				fullflag = false;//有空格子
			}
		}
	}
	if(canMoveFlag){
		setTimeout("updateView()",100);
		return 1;
	}
	if(fullflag){
		return 0;
	}
	return 2;
}
function moveBottom(){
	var canMoveFlag = false, 
	fullflag = true,//是否格子全满
	p;//记录碰撞位置
	for(var j = 0; j < 4; j++){
		p = 3;
		for(var i = 2; i >= 0; i--){
			//可以移动的条件：右边位置是0或者右边位置跟当前位置数字相等
			if(dataArr[i][j] != 0){
				for(k = p; k > i; k--){
					if(dataArr[k][j] == 0){
						showMoveAnimation(i,j,k,j);
						dataArr[k][j] = dataArr[i][j];
						dataArr[i][j] = 0;
						canMoveFlag = true;
					}else if(dataArr[k][j] == dataArr[i][j]){
						showMoveAnimation(i,j,k,j);
						p -= 1;
						dataArr[k][j] *= 2; 
						dataArr[i][j] = 0;
						canMoveFlag = true;
						score += dataArr[k][j];
						updateScore(score);
					}else{
						p -= 1;
					}
				}
			}else{
				fullflag = false;//有空格子
			}
		}
	}
	if(canMoveFlag){
		setTimeout("updateView()",100);
		return 1;
	}
	if(fullflag){
		return 0;
	}
	return 2;
}
function showMoveAnimation( fromx , fromy , tox, toy ){
    var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:getPosTop( tox , toy ),
        left:getPosLeft( tox , toy )
    },100);
}
function updateScore(score){
	$('#score').text(score);
}
function gameOver(){
	alert("GAMEOVER");
}