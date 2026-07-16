const polaris = document.getElementById("polaris");

const stars = document.querySelector(".stars");


let activated = false;



if(polaris && stars){


    polaris.addEventListener(
        "click",
        ()=>{


            if(activated) return;


            activated = true;



            // 北极星爆发

            polaris.classList.add(
                "starBirth"
            );



            // 开始生成星星

            for(let i = 0; i < 35; i++){


                setTimeout(()=>{

                    createStar();

                }, i * 80);


            }


        }
    );

}




function createStar(){


    const star =
    document.createElement("div");


    star.className =
    "childStar";



    let angle =
    Math.random() * Math.PI * 2;



    let radius =
    80 + Math.random() * 160;



    star.style.left =
    250 +
    Math.cos(angle) * radius +
    "px";



    star.style.top =
    150 +
    Math.sin(angle) * radius +
    "px";



    stars.appendChild(star);



    setTimeout(()=>{


        star.classList.add(
            "orbit"
        );


    },100);


}