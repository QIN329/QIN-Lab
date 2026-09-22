import * as THREE from "three";



export default class ExhibitionObject {



    constructor(data){


        this.data = data;



        this.group =

            new THREE.Group();



        this.create();


    }





    create(){



        const geometry =

            new THREE.BoxGeometry(

                0.8,

                0.8,

                0.8

            );





        const material =

            new THREE.MeshStandardMaterial({

                color:0xffffff,

                roughness:0.6

            });





        const mesh =

            new THREE.Mesh(

                geometry,

                material

            );



        this.group.add(

            mesh

        );





        this.group.userData.name =

            this.data.name;



        this.group.userData.description =

            this.data.description;





        this.group.userData.onHover =

            ()=>{


                mesh.scale.set(

                    1.15,

                    1.15,

                    1.15

                );


            };





        this.group.userData.onHoverOut =

            ()=>{


                mesh.scale.set(

                    1,

                    1,

                    1

                );


            };





        this.group.userData.onClick =

            ()=>{


                console.log(

                    this.data.name

                );


            };


    }





    getObject(){


        return this.group;


    }





    update(){



    }





    dispose(){


        this.group.clear();


    }


}