import * as THREE from "three";


export default class Core{


    constructor(){


        this.group =
            new THREE.Group();


        this.time = 0;


        this.create();


    }




    create(){



        // 核心光点

        const geometry =
            new THREE.SphereGeometry(

                0.08,

                32,

                32

            );




        this.material =
            new THREE.MeshBasicMaterial({

                color:0xffffff,

                transparent:true,

                opacity:0.65


            });





        this.core =
            new THREE.Mesh(

                geometry,

                this.material

            );



        this.group.add(

            this.core

        );







        // 光晕


        const glowGeometry =
            new THREE.SphereGeometry(

                0.25,

                32,

                32

            );





        this.glowMaterial =
            new THREE.MeshBasicMaterial({

                color:0xffffff,

                transparent:true,

                opacity:0.08,

                depthWrite:false


            });





        this.glow =
            new THREE.Mesh(

                glowGeometry,

                this.glowMaterial

            );




        this.group.add(

            this.glow

        );



    }






    update(delta){


        this.time += delta;




        const breath =

        (

            Math.sin(

                this.time * 1.5

            )

            +1

        )

        /2;





        this.core.scale.setScalar(

            0.9 +

            breath*0.3

        );




        this.glow.scale.setScalar(

            0.9 +

            breath*0.5

        );




        this.material.opacity =

        0.4 +

        breath*0.4;



        this.glowMaterial.opacity =

        0.03 +

        breath*0.08;



    }






    getObject(){


        return this.group;


    }



}