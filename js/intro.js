const intro = document.getElementById("intro");
const moon = document.getElementById("moon");
const space = document.getElementById("space");


// 8秒后隐藏开场文字

setTimeout(()=>{

    if(intro){
        intro.style.display="none";
    }

},8000);



// 8秒后显示月球

setTimeout(()=>{

    if(moon){
        moon.style.opacity="1";
    }

},8000);



// 12秒后进入星空

setTimeout(()=>{

    if(space){
        space.style.opacity="1";
    }

},12000);