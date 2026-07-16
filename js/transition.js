const polaris = document.getElementById("polaris");


if(polaris){

    polaris.onclick = ()=>{

        document.body.classList.add(
            "galaxy-transition"
        );


        setTimeout(()=>{

            window.location.href = "home.html";

        },3000);


    };

}