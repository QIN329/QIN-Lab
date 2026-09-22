import * as THREE from "three";

import {
    EffectComposer
}
from "three/examples/jsm/postprocessing/EffectComposer.js";


import {
    RenderPass
}
from "three/examples/jsm/postprocessing/RenderPass.js";


import {
    UnrealBloomPass
}
from "three/examples/jsm/postprocessing/UnrealBloomPass.js";


import {
    BokehPass
}
from "three/examples/jsm/postprocessing/BokehPass.js";




export default class PostProcessing {


    constructor(
        renderer,
        scene,
        camera
    ){


        this.renderer =
            renderer;


        this.scene =
            scene;


        this.camera =
            camera;



        this.composer =
            new EffectComposer(
                renderer
            );



        // =================================================
        // 基础渲染
        // =================================================


        const renderPass =
            new RenderPass(

                scene,

                camera

            );


        this.composer.addPass(
            renderPass
        );



        // =================================================
        // 柔和电影光
        // =================================================


        const bloom =
            new UnrealBloomPass(


                new THREE.Vector2(

                    window.innerWidth,

                    window.innerHeight

                ),


                0.18,


                0.35,


                0.85


            );



        this.composer.addPass(
            bloom
        );



        // =================================================
        // 摄影景深
        // =================================================


        this.bokeh =
            new BokehPass(


                scene,


                camera,


                {


                    focus:18,


                    aperture:0.00018,


                    maxblur:0.008


                }


            );



        this.composer.addPass(
            this.bokeh
        );



    }





    render(){


        this.composer.render();


    }





    resize(){


        this.composer.setSize(

            window.innerWidth,

            window.innerHeight

        );


    }



}