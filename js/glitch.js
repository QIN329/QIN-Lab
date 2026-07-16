const polaris =
document.getElementById(
"polaris"
);



const intro =
document.getElementById(
"intro"
);



const stars =
document.querySelector(
".stars"
);



let activated=false;



polaris.addEventListener(
"click",
()=>{


if(activated)

return;



activated=true;



// 文字进入轨道状态

intro.classList.add(
"orbitText"
);



// 生成环绕文字的星轨

createOrbit();



setTimeout(()=>{


document.body.classList.add(
"galaxy-transition"
);



},3500);



});







function createOrbit(){



for(let i=0;i<18;i++){



let star =
document.createElement(
"div"
);



star.className =
"orbitStar";



let angle =
(i/18)*360;



star.style.setProperty(
"--angle",
angle+"deg"
);



stars.appendChild(
star
);



}



}