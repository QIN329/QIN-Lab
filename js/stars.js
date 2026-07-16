const stars = document.querySelectorAll(".star");

const polaris = document.getElementById("polaris");


stars.forEach(star => {


    star.addEventListener(
    "mouseenter",
    ()=>{


        if(star !== polaris){


            star.style.boxShadow =
            "0 0 40px #fff,0 0 80px #7aaaff";


        }


    });



    star.addEventListener(
    "mouseleave",
    ()=>{


        if(star !== polaris){


            star.style.boxShadow =
            "0 0 15px white";


        }


    });


});