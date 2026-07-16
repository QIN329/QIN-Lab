const errorBox = document.getElementById("errorBox");


const normalStars = document.querySelectorAll(
    ".s1,.s2,.s3,.s4,.s5,.s6"
);



normalStars.forEach(star => {


    star.onclick = ()=>{


        if(errorBox){

            errorBox.classList.add("show");

        }


    };


});





const recover = document.getElementById("recover");


if(recover){


    recover.onclick = ()=>{


        errorBox.classList.remove("show");


    };


}