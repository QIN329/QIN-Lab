import * as THREE from "three";



// =====================================================

// QIN LAB · HOME SCENE

// REALISTIC CINEMATIC COUNTRYSIDE

//

// 第一阶段：

// 光 / 天空 / 远景空间

//

// 保持原接口完全一致

// =====================================================



export default class HomeScene {



constructor(events){



    this.events =

        events;



    this.group =

        new THREE.Group();




    this.time =

        0;



    this.windTime =

        0;




    // -----------------------------

    // objects

    // -----------------------------


    this.wheat = [];


    this.grass = [];


    this.trees = [];


    this.clouds = [];


    this.floatingParticles = [];


    this.swing = null;


    this.swingSeat = null;




    // -----------------------------

    // create

    // -----------------------------


    this.create();



}





// =====================================================

// CREATE

// =====================================================



create(){



    this.createLights();



    this.createSky();



    this.createSun();



    this.createFarMountains();



    this.createFarForest();



    this.createGround();



    this.createMeadow();



    this.createWheatField();



    this.createPath();



    this.createMidForest();



    this.createForegroundVegetation();



    this.createSwing();



    this.createClouds();



    this.createAtmosphere();


    // 摄影感增强层

    this.createAirPerspective();

    this.createForegroundDepth();

    this.createLightFilm();



}





// =====================================================

// LIGHT

// =====================================================



createLights(){




    // 清晨太阳


    this.sunLight =

        new THREE.DirectionalLight(


            0xffd7a3,


            2.2


        );




    this.sunLight.position.set(


        -10,


        15,


        8


    );




    this.sunLight.castShadow =

        true;




    this.sunLight.shadow.mapSize.width =

        2048;



    this.sunLight.shadow.mapSize.height =

        2048;




    this.sunLight.shadow.camera.near =

        1;



    this.sunLight.shadow.camera.far =

        60;




    this.sunLight.shadow.camera.left =

        -30;



    this.sunLight.shadow.camera.right =

        30;



    this.sunLight.shadow.camera.top =

        30;



    this.sunLight.shadow.camera.bottom =

        -30;




    this.sunLight.shadow.bias =

        -0.0002;




    this.group.add(

        this.sunLight

    );





    // 天空散射光



    const skyLight =

        new THREE.HemisphereLight(


            0xbfdfff,


            0x756044,


            1.4


        );




    this.group.add(

        skyLight

    );





    // 柔光



    const fill =

        new THREE.DirectionalLight(


            0xc7dcff,


            0.25


        );




    fill.position.set(


        10,


        6,


        -10


    );



    this.group.add(

        fill

    );




}





// =====================================================

// SKY

// =====================================================



createSky(){




    const geometry =

        new THREE.SphereGeometry(


            120,


            64,


            32


        );




    const material =

        new THREE.MeshBasicMaterial({


            color:0x9ed8ff,


            side:

                THREE.BackSide,


            depthWrite:false


        });




    this.sky =

        new THREE.Mesh(


            geometry,


            material


        );




    this.sky.position.y =

        10;




    this.group.add(

        this.sky

    );




}





// =====================================================

// SUN

// =====================================================



createSun(){




    const geometry =

        new THREE.SphereGeometry(


            0.45,


            32,


            32


        );




    const material =

        new THREE.MeshBasicMaterial({


            color:0xffefc0


        });




    this.sun =

        new THREE.Mesh(


            geometry,


            material


        );




    this.sun.position.set(


        -18,


        12,


        -25


    );




    this.group.add(

        this.sun

    );





    const glow =

        new THREE.Mesh(


            new THREE.SphereGeometry(


                3,


                32,


                32


            ),



            new THREE.MeshBasicMaterial({


                color:0xffc978,


                transparent:true,


                opacity:0.06,


                depthWrite:false


            })


        );




    glow.position.copy(

        this.sun.position

    );




    this.sunGlow =

        glow;




    this.group.add(

        glow

    );




}




// =====================================================

// FAR MOUNTAINS

// 真实摄影远山

// =====================================================



createFarMountains(){




    const mountainData = [



        [-14,-20,8,4.5],


        [-8,-22,10,5.5],


        [-2,-23,12,6],


        [5,-22,11,5],


        [12,-20,9,4.5]


    ];




    mountainData.forEach(


        data=>{



            this.createMountain(


                data[0],


                -1.2,


                data[1],


                data[2],


                data[3]


            );



        }


    );



}





createMountain(


    x,


    y,


    z,


    width,


    height


){




    const group =

        new THREE.Group();





    // 多个不规则体组合

    // 避免游戏锥形山



    const material =

        new THREE.MeshStandardMaterial({


            color:0x788f8c,


            roughness:1,


            metalness:0


        });





    const parts = [


        [


            0,


            0,


            1,


            1


        ],


        [


            -0.35,


            0.15,


            0.75,


            0.8


        ],


        [


            0.45,


            0.2,


            0.85,


            0.75


        ]


    ];




    parts.forEach(


        p=>{



            const mesh =

                new THREE.Mesh(


                    new THREE.SphereGeometry(


                        1,


                        18,


                        12


                    ),


                    material


                );




            mesh.scale.set(


                width*p[2],


                height*p[3],


                width*0.55


            );




            mesh.position.set(


                p[0]*width,


                p[1]*height,


                0


            );




            group.add(

                mesh

            );



        }


    );





    group.position.set(


        x,


        y,


        z


    );




    this.group.add(

        group

    );



}






// =====================================================

// FAR FOREST

// 远景树林

// =====================================================



createFarForest(){




    for(


        let i=0;


        i<45;


        i++


    ){




        const x =

            -18 +

            i*0.8 +

            (Math.random()-0.5);




        const z =

            -15 -

            Math.random()*5;




        const height =

            2.5 +

            Math.random()*3;




        this.createFarTree(


            x,


            z,


            height


        );




    }




}





createFarTree(


    x,


    z,


    height


){




    const tree =

        new THREE.Group();




    tree.position.set(


        x,


        -1.3,


        z


    );




    const trunk =

        new THREE.Mesh(


            new THREE.CylinderGeometry(


                0.05,


                0.12,


                height,


                7


            ),



            new THREE.MeshStandardMaterial({


                color:0x5a4935,


                roughness:1


            })


        );




    trunk.position.y =

        height/2;




    tree.add(

        trunk

    );






    const colors=[


        0x38543d,


        0x46684a,


        0x527453,


        0x607d58


    ];





    for(


        let i=0;


        i<5;


        i++


    ){




        const leaf =

            new THREE.Mesh(


                new THREE.SphereGeometry(


                    0.55+


                    Math.random()*0.4,


                    12,


                    10


                ),




                new THREE.MeshStandardMaterial({


                    color:


                    colors[


                    Math.floor(


                    Math.random()


                    *


                    colors.length


                    )


                    ],



                    roughness:1


                })


            );





        leaf.position.set(


            (Math.random()-0.5)*0.8,


            height*0.55+


            Math.random()*1.1,


            (Math.random()-0.5)*0.6


        );




        leaf.scale.y =

            0.8;




        tree.add(

            leaf

        );



    }




    // 远景降低存在感


    tree.scale.multiplyScalar(


        0.75


    );




    this.group.add(

        tree

    );



}





// =====================================================

// GROUND

// =====================================================



createGround(){




    const geometry =

        new THREE.PlaneGeometry(


            55,


            45,


            50,


            50


        );





    const material =

        new THREE.MeshStandardMaterial({


            color:0x70684b,


            roughness:1


        });





    this.ground =

        new THREE.Mesh(


            geometry,


            material


        );




    this.ground.rotation.x =

        -Math.PI/2;




    this.ground.position.set(


        0,


        -1.5,


        -2


    );




    this.ground.receiveShadow =

        true;




    this.group.add(

        this.ground

    );



}





// =====================================================

// MEADOW

// 真实草地

// =====================================================



createMeadow(){



    const geometry =

        new THREE.PlaneGeometry(


            14,


            25,


            40,


            40


        );




    const material =

        new THREE.MeshStandardMaterial({


            color:0x557747,


            roughness:1


        });




    this.meadow =

        new THREE.Mesh(


            geometry,


            material


        );




    this.meadow.rotation.x =

        -Math.PI/2;




    this.meadow.position.set(


        5,


        -1.46,


        -2


    );




    this.meadow.receiveShadow =

        true;




    this.group.add(

        this.meadow

    );





    // 草


    for(


        let i=0;


        i<900;


        i++


    ){



        const grass =

            this.createGrass();




        grass.position.set(


            0.5+


            Math.random()*10,


            -1.45,


            -12+


            Math.random()*22


        );




        const scale =

            0.4+


            Math.random()*1.4;




        grass.scale.set(


            scale,


            scale,


            scale


        );




        this.group.add(

            grass

        );




        this.grass.push({


            object:grass,


            offset:

            Math.random()*

            Math.PI*2,



            speed:

            0.5+

            Math.random()*0.8,



            strength:

            0.04+

            Math.random()*0.08



        });



    }



}





createGrass(){




    const geometry =

        new THREE.PlaneGeometry(


            0.12,


            0.7


        );




    const material =

        new THREE.MeshStandardMaterial({


            color:


            [


                0x42683b,


                0x567c42,


                0x668d4c,


                0x789957


            ][


            Math.floor(


            Math.random()*4


            )


            ],



            side:

            THREE.DoubleSide,



            roughness:1



        });




    const blade =

        new THREE.Mesh(


            geometry,


            material


        );




    blade.rotation.y =

        Math.random()*

        Math.PI;




    blade.rotation.z =

        (

            Math.random()-0.5

        )

        *

        0.25;




    return blade;



}







// =====================================================

// WHEAT FIELD

// 麦田

// =====================================================



createWheatField(){



    for(


        let x=0;


        x<450;


        x++


    ){




        const wheat =

            this.createWheat();




        wheat.position.set(


            -11+


            Math.random()*8,


            -1.45,


            -12+


            Math.random()*22


        );




        const scale =

            0.65+


            Math.random()*0.7;




        wheat.scale.set(


            scale,


            scale,


            scale


        );




        wheat.rotation.y =

            Math.random()

            *

            Math.PI;




        this.group.add(

            wheat

        );




        this.wheat.push({


            object:wheat,



            offset:

            Math.random()*

            Math.PI*2,



            speed:

            0.6+

            Math.random()*0.6,



            strength:

            0.04



        });




    }




}







// =====================================================

// SINGLE WHEAT

// =====================================================



createWheat(){



    const group =

        new THREE.Group();




    const stem =

        new THREE.Mesh(


            new THREE.CylinderGeometry(


                0.015,


                0.025,


                1.4,


                6


            ),




            new THREE.MeshStandardMaterial({


                color:0x71853c,


                roughness:1


            })


        );




    stem.position.y=

        0.7;




    group.add(

        stem

    );





    const head =

        new THREE.Mesh(


            new THREE.SphereGeometry(


                0.08,


                8,


                6


            ),



            new THREE.MeshStandardMaterial({


                color:0xd4aa48,


                roughness:1


            })


        );




    head.position.y=

        1.35;




    head.scale.set(


        0.6,


        2,


        0.6


    );




    group.add(

        head

    );




    return group;



}







// =====================================================

// PATH

// 土路

// =====================================================



createPath(){




    const geometry =

        new THREE.PlaneGeometry(


            1.8,


            25,


            20,


            20


        );




    const material =

        new THREE.MeshStandardMaterial({


            color:0xa57b52,


            roughness:1


        });




    const path =

        new THREE.Mesh(


            geometry,


            material


        );




    path.rotation.x =

        -Math.PI/2;




    path.position.set(


        -0.8,


        -1.42,


        -1


    );




    this.group.add(

        path

    );





    // 路面碎石



    for(


        let i=0;


        i<120;


        i++


    ){




        const stone =

            new THREE.Mesh(


                new THREE.SphereGeometry(


                    0.03+


                    Math.random()*0.05,


                    6,


                    5


                ),



                new THREE.MeshStandardMaterial({


                    color:0x806247,


                    roughness:1


                })


            );




        stone.position.set(


            -0.8+


            (Math.random()-0.5),


            -1.38,


            -12+


            Math.random()*22


        );




        stone.scale.y=0.3;




        this.group.add(

            stone

        );



    }



}

// =====================================================

// D

// CINEMATIC CAMERA ATMOSPHERE SYSTEM

// 真实摄影空气层

// =====================================================



createAtmosphere(){



    // -----------------------------

    // 空气漂浮颗粒

    // -----------------------------



    const geometry =

        new THREE.BufferGeometry();




    const count = 350;




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

            -12 +

            Math.random()*24;




        positions[i*3+1] =

            -0.2 +

            Math.random()*7;




        positions[i*3+2] =

            -15 +

            Math.random()*20;



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


            color:0xffe6bd,


            size:0.018,


            transparent:true,


            opacity:0.12,


            depthWrite:false


        });





    this.atmosphere =

        new THREE.Points(


            geometry,


            material


        );




    this.group.add(

        this.atmosphere

    );


}





// =====================================================

// CINEMATIC COLOR LAYER

// 空气颜色变化

// =====================================================



createAirPerspective(){




    this.airColor =

        new THREE.Color(

            0xcfe4ed

        );




}




// =====================================================

// FOREGROUND DEPTH

// 摄影前景层

// =====================================================



createForegroundDepth(){




    const group =

        new THREE.Group();




    // 前景暗色植物


    for(

        let i = 0;

        i < 45;

        i++

    ){




        const grass =

            this.createGrass();




        grass.scale.set(


            1.5 +

            Math.random(),


            1.8 +

            Math.random(),


            1.5


        );




        grass.position.set(


            -12 +

            Math.random()*24,


            -1.42,


            5 +

            Math.random()*3


        );




        group.add(

            grass

        );



        this.grass.push({


            object:grass,


            offset:

                Math.random() *

                Math.PI * 2,



            speed:

                0.4 +

                Math.random()*0.5,



            strength:

                0.12


        });




    }




    this.group.add(

        group

    );




}







// =====================================================

// LIGHT FILM EFFECT

// 柔光

// =====================================================



createLightFilm(){




    const plane =

        new THREE.Mesh(


            new THREE.PlaneGeometry(

                30,

                20

            ),



            new THREE.MeshBasicMaterial({


                color:0xffd59a,


                transparent:true,


                opacity:0.035,


                depthWrite:false


            })


        );




    plane.position.set(


        -8,


        4,


        -18


    );




    this.group.add(

        plane

    );



}


    // =====================================================

    // MID FOREST

    // 中景树林：避免规则排列，降低卡通感

    // =====================================================


    createMidForest(){


        const positions = [

            [-10.5, -8.5, 1.45],

            [-8.8, -9.4, 1.25],

            [-6.8, -10.3, 1.55],

            [-4.7, -10.8, 1.35],

            [3.0, -11.2, 1.45],

            [4.8, -10.4, 1.55],

            [6.7, -9.3, 1.35],

            [8.8, -8.5, 1.5],

            [10.8, -7.7, 1.3]

        ];


        positions.forEach(data=>{

            this.createTree(data[0], data[1], data[2]);

        });

    }



    // =====================================================

    // TREE

    // =====================================================


    createTree(x,z,scale){


        const tree = new THREE.Group();


        tree.position.set(x,-1.45,z);

        tree.scale.setScalar(scale);


        const trunkMaterial = new THREE.MeshStandardMaterial({

            color:0x584333,

            roughness:0.94,

            metalness:0

        });


        const trunk = new THREE.Mesh(

            new THREE.CylinderGeometry(0.09,0.18,2.8,10),

            trunkMaterial

        );


        trunk.position.y = 1.4;

        trunk.castShadow = true;

        tree.add(trunk);


        const leafColors = [

            0x315a39,

            0x3d6840,

            0x4d7446,

            0x5b7f4d,

            0x6b8753

        ];


        for(let i=0;i<13;i++){


            const foliage = new THREE.Mesh(

                new THREE.SphereGeometry(

                    0.42 + Math.random()*0.38,

                    14,

                    10

                ),

                new THREE.MeshStandardMaterial({

                    color:leafColors[Math.floor(Math.random()*leafColors.length)],

                    roughness:0.98,

                    metalness:0

                })

            );


            foliage.position.set(

                (Math.random()-0.5)*1.25,

                2.35 + Math.random()*1.45,

                (Math.random()-0.5)*0.95

            );


            foliage.scale.set(

                1.0 + Math.random()*0.22,

                0.65 + Math.random()*0.3,

                0.8 + Math.random()*0.18

            );


            foliage.castShadow = true;

            tree.add(foliage);

        }


        this.group.add(tree);


        this.trees.push({

            object:tree,

            offset:Math.random()*Math.PI*2,

            strength:0.006 + Math.random()*0.007

        });

    }



    // =====================================================

    // FOREGROUND VEGETATION

    // =====================================================


    createForegroundVegetation(){


        for(let i=0;i<180;i++){


            const grass = this.createGrass();


            grass.position.set(

                -12 + Math.random()*24,

                -1.42,

                2.5 + Math.random()*5.5

            );


            const scale = 1.2 + Math.random()*2.0;

            grass.scale.set(scale,scale*1.35,scale);


            this.group.add(grass);


            this.grass.push({

                object:grass,

                offset:Math.random()*Math.PI*2,

                speed:0.45 + Math.random()*0.55,

                strength:0.06 + Math.random()*0.08

            });

        }

    }



    // =====================================================

    // SWING

    // =====================================================


    createSwing(){


        this.swing = new THREE.Group();

        this.swing.position.set(5.4,-1.45,1.2);


        const wood = new THREE.MeshStandardMaterial({

            color:0x70492f,

            roughness:0.72

        });


        const left = this.createWoodPost(-1.05,wood);

        const right = this.createWoodPost(1.05,wood);

        this.swing.add(left,right);


        const beam = new THREE.Mesh(

            new THREE.CylinderGeometry(0.13,0.13,2.35,14),

            wood

        );


        beam.rotation.z = Math.PI/2;

        beam.position.y = 3.35;

        beam.castShadow = true;

        this.swing.add(beam);


        const swingGroup = new THREE.Group();

        swingGroup.position.y = 3.35;

        this.swing.add(swingGroup);


        const rope = new THREE.MeshStandardMaterial({

            color:0x9b805b,

            roughness:0.92

        });


        const ropeLeft = new THREE.Mesh(

            new THREE.CylinderGeometry(0.022,0.022,2.05,8),

            rope

        );

        ropeLeft.position.set(-0.43,-1.0,0);


        const ropeRight = ropeLeft.clone();

        ropeRight.position.x = 0.43;


        swingGroup.add(ropeLeft,ropeRight);


        const seat = new THREE.Mesh(

            new THREE.BoxGeometry(1.08,0.15,0.44),

            new THREE.MeshStandardMaterial({

                color:0x81552f,

                roughness:0.62

            })

        );


        seat.position.set(0,-2.03,0);

        seat.castShadow = true;

        swingGroup.add(seat);


        this.swingSeat = swingGroup;

        this.group.add(this.swing);

    }



    createWoodPost(x,material){


        const post = new THREE.Mesh(

            new THREE.CylinderGeometry(0.11,0.17,3.45,12),

            material

        );


        post.position.set(x,1.72,0);

        post.rotation.z = x < 0 ? -0.075 : 0.075;

        post.castShadow = true;

        return post;

    }



    // =====================================================

    // CLOUDS

    // =====================================================


    createClouds(){


        const data = [

            [-7.0,7.5,-14,1.35],

            [0.5,8.6,-17,1.05],

            [7.0,7.2,-14,1.25],

            [-1.5,9.3,-20,0.8]

        ];


        data.forEach(d=>this.createCloud(d[0],d[1],d[2],d[3]));

    }



    createCloud(x,y,z,scale){


        const cloud = new THREE.Group();

        cloud.position.set(x,y,z);

        cloud.scale.setScalar(scale);


        const material = new THREE.MeshStandardMaterial({

            color:0xf4f1e9,

            roughness:1,

            transparent:true,

            opacity:0.78,

            depthWrite:false

        });


        const pieces = [

            [-0.8,0,0,0.8],

            [-0.3,0.18,0,1.0],

            [0.25,0.12,0,1.1],

            [0.75,0,0,0.72],

            [0.05,-0.08,0.05,1.15]

        ];


        pieces.forEach(p=>{

            const mesh = new THREE.Mesh(

                new THREE.SphereGeometry(p[3],16,10),

                material

            );

            mesh.position.set(p[0],p[1],p[2]);

            mesh.scale.y = 0.42;

            cloud.add(mesh);

        });


        this.group.add(cloud);


        this.clouds.push({

            object:cloud,

            speed:0.7 + Math.random()*0.35,

            direction:Math.random()>0.5 ? 1 : -1

        });

    }



    // =====================================================

    // UPDATE

    // =====================================================


    update(delta){


        this.time += delta;

        this.windTime += delta;


        this.wheat.forEach(item=>{

            const wave = Math.sin(

                this.windTime*item.speed + item.offset

            );

            item.object.rotation.z = wave*item.strength;

        });


        this.grass.forEach(item=>{

            item.object.rotation.z = Math.sin(

                this.windTime*item.speed + item.offset

            ) * item.strength;

        });


        this.trees.forEach(item=>{

            item.object.rotation.z = Math.sin(

                this.windTime*0.42 + item.offset

            ) * item.strength;

        });


        if(this.swingSeat){

            this.swingSeat.rotation.x = Math.sin(this.time*0.72)*0.075;

        }


        this.clouds.forEach(item=>{

            item.object.position.x += delta*item.speed*item.direction;

            if(item.object.position.x > 16) item.object.position.x = -16;

            if(item.object.position.x < -16) item.object.position.x = 16;

        });


        if(this.atmosphere){

            this.atmosphere.rotation.y += delta*0.004;

        }

    }



    // =====================================================

    // GET OBJECT

    // =====================================================


    getObject(){

        return this.group;

    }



    // =====================================================

    // INTERACTION

    // =====================================================


    getInteractiveObjects(){

        return [];

    }



    // =====================================================

    // DISPOSE

    // =====================================================


    dispose(){


        this.group.traverse(object=>{


            if(object.geometry){

                object.geometry.dispose();

            }


            if(object.material){

                if(Array.isArray(object.material)){

                    object.material.forEach(material=>material.dispose());

                }else{

                    object.material.dispose();

                }

            }

        });


        this.group.clear();

    }


}