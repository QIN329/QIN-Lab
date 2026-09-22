import * as THREE from "three";


export default class DustParticles {



    constructor(){


        this.group = new THREE.Group();


        this.time = 0;


        this.create();


    }





    create(){



        const count = 350;



        const geometry =

            new THREE.BufferGeometry();



        const positions =

            new Float32Array(

                count * 3

            );



        for(

            let i = 0;

            i < count;

            i++

        ){



            positions[i*3] =

                (Math.random()-0.5) * 8;



            positions[i*3+1] =

                Math.random() * 5 - 1;



            positions[i*3+2] =

                Math.random() * 4 - 2;



        }





        geometry.setAttribute(

            "position",

            new THREE.BufferAttribute(

                positions,

                3

            )

        );





        const material =

            new THREE.PointsMaterial({

                color:0xffe4b0,

                size:0.025,

                transparent:true,

                opacity:0.45,

                depthWrite:false

            });





        this.points =

            new THREE.Points(

                geometry,

                material

            );



        this.group.add(

            this.points

        );


    }





    update(delta){



        this.time += delta;



        const position =

            this.points.geometry.attributes.position;



        for(

            let i = 0;

            i < position.count;

            i++

        ){



            let x =

                position.getX(i);



            let y =

                position.getY(i);



            x +=

                Math.sin(

                    this.time + i

                ) * 0.0008;



            y +=

                Math.sin(

                    this.time * 0.5 + i

                ) * 0.001;



            position.setX(

                i,

                x

            );



            position.setY(

                i,

                y

            );



        }



        position.needsUpdate = true;


    }





    getObject(){


        return this.group;


    }


}