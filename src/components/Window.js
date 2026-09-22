import * as THREE from "three";


export default class Window {


    constructor(){


        this.group = new THREE.Group();


        this.create();


    }





    create(){


        this.createFrame();


        this.createGlass();


    }





    createFrame(){


        const wood =

            new THREE.MeshStandardMaterial({

                color:0x6b4328,

                roughness:0.8

            });



        // 左框

        const left =

            new THREE.Mesh(

                new THREE.BoxGeometry(

                    0.15,

                    5,

                    0.2

                ),

                wood

            );


        left.position.x = -3;


        this.group.add(left);





        // 右框

        const right =

            left.clone();


        right.position.x = 3;


        this.group.add(right);





        // 上下

        const top =

            new THREE.Mesh(

                new THREE.BoxGeometry(

                    6,

                    0.15,

                    0.2

                ),

                wood

            );


        top.position.y = 2.5;


        this.group.add(top);




        const bottom =

            top.clone();


        bottom.position.y = -2.5;


        this.group.add(bottom);





        // 十字

        const crossV =

            new THREE.Mesh(

                new THREE.BoxGeometry(

                    0.12,

                    5,

                    0.25

                ),

                wood

            );


        this.group.add(crossV);





        const crossH =

            new THREE.Mesh(

                new THREE.BoxGeometry(

                    6,

                    0.12,

                    0.25

                ),

                wood

            );


        this.group.add(crossH);



    }





    createGlass(){


        const glass =

            new THREE.Mesh(

                new THREE.PlaneGeometry(

                    6,

                    5

                ),

                new THREE.MeshPhysicalMaterial({

                    color:0x9edcff,

                    transparent:true,

                    opacity:0.25,

                    roughness:0,

                    transmission:0.5

                })

            );


        glass.position.z = -0.05;


        this.group.add(

            glass

        );


    }





    getObject(){


        return this.group;


    }


}