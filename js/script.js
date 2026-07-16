const cursor = document.querySelector(".cursor");


document.addEventListener(
"mousemove",
(e)=>{

    cursor.style.left =
    e.clientX + "px";

    cursor.style.top =
    e.clientY + "px";

});



const shells =
document.querySelectorAll(".shell");


document.addEventListener(
"mousemove",
(e)=>{


    shells.forEach(shell=>{


        const rect =
        shell.getBoundingClientRect();


        const x =
        rect.left + rect.width / 2;


        const y =
        rect.top + rect.height / 2;


        const distance =
        Math.sqrt(

        (e.clientX-x)**2 +

        (e.clientY-y)**2

        );


        if(distance < 120){

            shell.classList.add("near");

        }

        else{

            shell.classList.remove("near");

        }


    });


});




const polaris =
document.querySelector(".polaris");


const galaxy =
document.querySelector(".text-galaxy");


if(polaris){

    polaris.addEventListener(
    "click",
    ()=>{

        document.body.classList.add(
        "entering"
        );


        for(let i=0;i<60;i++){

            const text =
            document.createElement("span");


            text.innerHTML =
            i%2===0
            ?
            "I LOVE"
            :
            "I KNOW";


            text.style.left =
            Math.random()*100+"vw";


            text.style.top =
            Math.random()*100+"vh";


            text.style.animationDelay =
            (i*0.04)+"s";


            galaxy.appendChild(text);

        }


        setTimeout(()=>{

            window.location.href =
            "home.html";

        },5000);


    });

}