const wave = document.getElementById("wave");


document.addEventListener(
"mousemove",
(e)=>{

    if(wave){

        wave.style.left = e.clientX + "px";

        wave.style.top = e.clientY + "px";


        wave.classList.remove("ripple");


        void wave.offsetWidth;


        wave.classList.add("ripple");

    }

});