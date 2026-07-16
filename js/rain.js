const floor = document.getElementById("rainFloor");


function createRipple(){

    const ripple = document.createElement("div");


    ripple.className = "rainRipple";


    ripple.style.left =
    Math.random() * 100 + "%";


    ripple.style.bottom =
    Math.random() * 80 + "px";


    floor.appendChild(ripple);



    setTimeout(()=>{

        ripple.remove();

    },3000);

}



if(floor){

    setInterval(
        createRipple,
        350
    );

}