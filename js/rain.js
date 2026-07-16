const floor =
document.getElementById(
"rainFloor"
);



function createRain(){


let x =
Math.random()*100;



for(let i=0;i<4;i++){



let ripple =
document.createElement(
"div"
);



ripple.className =
"rainRipple";



ripple.style.left =
x+"%";



ripple.style.bottom =
Math.random()*80+"px";



ripple.style.animationDelay =
(i*0.15)+"s";



floor.appendChild(
ripple
);



setTimeout(()=>{


ripple.remove();


},3000);



}



}




setInterval(
createRain,
600
);