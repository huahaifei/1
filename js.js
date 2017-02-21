var CANVAS_WIDTH = 1024;
var	CANVAS_HEIGHT = 400;
var MARGINTOP = 60;
var MARGINLEFT = 30;
var RADIUS = 8;
var end = new Date();
end.setTime(end.getTime()+3600*1000);

var curShowTimeSeconds = 0;
var index = 1;
var isReady = false;
var balls = [];
var color = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload=function(){
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	$('#clock').on('click',function(){
		curShowTimeSeconds = setNowShowTimeSeconds();
		index = 1;
		if(isReady){
			clearInterval(timer);
			isReady = false;
		}
		start(context);
	})
	$('#countDown').on('click',function(){
		end = new Date();
		end.setTime(end.getTime()+3600*1000);
		curShowTimeSeconds = setCurShowTimeSeconds();
		index = 0;
		if(isReady){
			clearInterval(timer);
			isReady = false;
		}
		start(context);
	}) 		
	
}
function start(cxt){
	timer = setInterval(function(){
			render(cxt);
			upDate();
			isReady = true;
	},50)
}
function upDate(){
	var	nextShowTimeSeconds = 0;
	if(index == 1)
		nextShowTimeSeconds = setNowShowTimeSeconds();	
	else
		nextShowTimeSeconds = setCurShowTimeSeconds();
	var nexthour = parseInt((nextShowTimeSeconds/3600));	
	var nextminute = parseInt((nextShowTimeSeconds-nexthour*3600)/60);	
	var nextsecond = parseInt(nextShowTimeSeconds%60);

	var curhour = parseInt((curShowTimeSeconds/3600));	
	var curminute = parseInt((curShowTimeSeconds-curhour*3600)/60);
	var cursecond = parseInt(curShowTimeSeconds%60);

	if(nextsecond != cursecond){
		if(parseInt(nexthour/10) != parseInt(curhour/10)){
			addball(MARGINLEFT, MARGINTOP, parseInt(curhour/10));
		}
		if(parseInt(nexthour%10) != parseInt(curhour%10)){
			addball(MARGINLEFT+15*(RADIUS+1), MARGINTOP, parseInt(curhour%10));
		}
		if(parseInt(nextminute/10) != parseInt(curminute/10)){
			addball(MARGINLEFT+39*(RADIUS+1), MARGINTOP, parseInt(curminute/10));
		}
		if(parseInt(nextminute%10) != parseInt(curminute%10)){
			addball(MARGINLEFT+54*(RADIUS+1), MARGINTOP, parseInt(curminute%10));
		}
		if(parseInt(nextsecond/10) != parseInt(cursecond/10)){
			addball(MARGINLEFT+78*(RADIUS+1), MARGINTOP, parseInt(cursecond/10));
		}
		if(parseInt(nextsecond%10) != parseInt(cursecond%10)){
			addball(MARGINLEFT+93*(RADIUS+1), MARGINTOP, parseInt(nextsecond%10));
		}

		curShowTimeSeconds=nextShowTimeSeconds;
	}
	upballs();
}
function upballs(){
	for (var i = balls.length - 1; i >= 0; i--) {
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;

		if(balls[i].y>=CANVAS_HEIGHT-RADIUS){
			balls[i].y=CANVAS_HEIGHT-RADIUS;
			balls[i].vy=-1*balls[i].vy*0.65;
		}
	}
	var count = 0;

	for (var i = 0; i<balls.length; i++){
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<CANVAS_WIDTH){
			balls[count++] = balls[i];
		}	
	}
	while(balls.length>Math.min(350, count)){
		balls.pop();
	}
}
function addball(x, y, num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var aball ={
				x:x+(2*j+1)*(RADIUS+1),
				y:y+(2*i+1)*(RADIUS+1),
				color:color[Math.floor(Math.random()*color.length)],
				vx:parseInt((Math.random()*10))%2==1?7:-7,
				vy:-5,
				g:1.5+Math.random(),
				};
				balls.push(aball);
			}
			
		}
	}
}
function setCurShowTimeSeconds(){
	var now = new Date();
	var ret = end.getTime()-now.getTime();
	ret = Math.round(ret/1000);
	return ret>=0?ret:0;
}
function setNowShowTimeSeconds(){
	var now = new Date();
	var ret = now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
	return ret;
}

function render(cxt){
	cxt.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	var hour = parseInt((curShowTimeSeconds/3600));	
	var minute = parseInt((curShowTimeSeconds-hour*3600)/60);
	var second = parseInt(curShowTimeSeconds%60);

	renderDigit(MARGINLEFT, MARGINTOP, parseInt(hour/10), cxt);
	renderDigit(MARGINLEFT+15*(RADIUS+1), MARGINTOP, parseInt(hour%10), cxt);
	renderDigit(MARGINLEFT+30*(RADIUS+1), MARGINTOP, 10, cxt);
	renderDigit(MARGINLEFT+39*(RADIUS+1), MARGINTOP, parseInt(minute/10), cxt);
	renderDigit(MARGINLEFT+54*(RADIUS+1), MARGINTOP, parseInt(minute%10), cxt);
	renderDigit(MARGINLEFT+69*(RADIUS+1), MARGINTOP, 10, cxt);
	renderDigit(MARGINLEFT+78*(RADIUS+1), MARGINTOP, parseInt(second/10), cxt);
	renderDigit(MARGINLEFT+93*(RADIUS+1), MARGINTOP, parseInt(second%10), cxt);

	for(var i=0; i<balls.length; i++){
		cxt.fillStyle=balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
		cxt.closePath();
		cxt.fill();
	}
}

function renderDigit(x, y, num, cxt){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+(2*j+1)*(RADIUS+1),y+(2*i+1)*(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();
				cxt.fillStyle='blue';
				cxt.fill();
			}
		}
	}
}
