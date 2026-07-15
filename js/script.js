const cursor = document.querySelector(".cursor");


document.addEventListener(
"mousemove",
(e)=>{

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

});



const stars = document.querySelectorAll(".star");


document.addEventListener(
"mousemove",
(e)=>{


    stars.forEach(star=>{


        const rect = star.getBoundingClientRect();


        const starX = rect.left + rect.width / 2;


        const starY = rect.top + rect.height / 2;


        const distance = Math.sqrt(

            (e.clientX-starX)**2 +

            (e.clientY-starY)**2

        );



        if(distance < 130){

            star.classList.add("near");

        }

        else if(!star.classList.contains("found")){

            star.classList.remove("near");

        }


    });


});




stars.forEach(star=>{


    star.addEventListener(
    "click",
    ()=>{

        star.classList.add("found");

    });


});





const polaris = document.querySelector(".polaris");


polaris.addEventListener(
"click",
()=>{

    document.body.classList.add("entering");


    setTimeout(()=>{

        window.location.href="home.html";

    },3000);


});
()=>{

    document.body.classList.add("entering");

};