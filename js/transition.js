const polaris = document.getElementById("polaris");


let entered = false;



if(polaris){


    polaris.addEventListener(
        "click",
        ()=>{


            if(entered) return;


            entered = true;



            document.body.classList.add(
                "galaxy-transition"
            );



            setTimeout(()=>{


                window.location.href =
                "home.html";


            },4000);



        }
    );


}