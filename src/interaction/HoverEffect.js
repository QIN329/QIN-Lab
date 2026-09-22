import { gsap } from "gsap";



export default class HoverEffect {



    constructor(object){


        this.object = object;



        this.targetScale = 1;



    }





    enter(){


        this.targetScale = 1.15;



        gsap.to(

            this.object.scale,

            {

                x:this.targetScale,

                y:this.targetScale,

                z:this.targetScale,

                duration:0.4,

                ease:"power2.out"

            }

        );


    }





    leave(){


        this.targetScale = 1;



        gsap.to(

            this.object.scale,

            {

                x:1,

                y:1,

                z:1,

                duration:0.4,

                ease:"power2.out"

            }

        );


    }





    dispose(){


        this.object = null;


    }


}