import * as THREE from "three";


export default class LightBeam {


    constructor(){


        this.group = new THREE.Group();


        this.create();


    }





    create(){



        const geometry =

            new THREE.ConeGeometry(

                2.5,

                8,

                32,

                1,

                true

            );



        const material =

            new THREE.MeshBasicMaterial({

                color:0xffd28a,

                transparent:true,

                opacity:0.12,

                side:THREE.DoubleSide,

                depthWrite:false

            });



        this.beam =

            new THREE.Mesh(

                geometry,

                material

            );



        this.beam.rotation.x =

            Math.PI / 2;



        this.beam.position.set(

            0,

            1,

            -1

        );



        this.group.add(

            this.beam

        );



    }





    update(time){



        if(!this.beam)

            return;



        this.beam.material.opacity =

            0.1 +

            Math.sin(time)*0.03;


    }





    getObject(){


        return this.group;


    }


}