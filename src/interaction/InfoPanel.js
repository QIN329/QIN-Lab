import { gsap } from "gsap";



export default class InfoPanel {



    constructor(){


        this.create();


    }





    create(){



        this.panel =

            document.createElement(

                "div"

            );



        this.panel.className =

            "info-panel";



        this.panel.innerHTML = `

            <h2></h2>

            <p></p>

        `;



        document

        .getElementById("app")

        .appendChild(

            this.panel

        );



        this.hide();


    }





    show(data){



        this.panel.querySelector(

            "h2"

        ).innerText =

            data.name;



        this.panel.querySelector(

            "p"

        ).innerText =

            data.description;





        gsap.to(

            this.panel,

            {

                opacity:1,

                duration:0.5

            }

        );


    }





    hide(){



        gsap.set(

            this.panel,

            {

                opacity:0

            }

        );


    }





    toggle(data){



        if(

            this.panel.style.opacity === "1"

        ){


            this.hide();


        }

        else{


            this.show(data);


        }


    }





    dispose(){


        this.panel.remove();


    }


}