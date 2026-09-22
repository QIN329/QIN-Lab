import * as THREE from "three";

import EventBus from "./EventBus.js";
import SceneManager from "./SceneManager.js";
import Interaction from "./Interaction.js";

import LandingScene from "../scenes/LandingScene.js";


export default class App {

    constructor(){

        // =====================================================
        // CLOCK
        // =====================================================

        this.clock =
            new THREE.Clock();


        // =====================================================
        // MAIN SCENE
        // =====================================================

        this.scene =
            new THREE.Scene();


        // =====================================================
        // BACKGROUND
        // =====================================================

        this.backgroundColor =
            new THREE.Color(
                0x050816
            );

        this.scene.background =
            this.backgroundColor;


        // =====================================================
        // EVENT BUS
        // =====================================================

        this.events =
            new EventBus();


        // =====================================================
        // CAMERA
        // =====================================================

        this.createCamera();


        // =====================================================
        // RENDERER
        // =====================================================

        this.createRenderer();


        // =====================================================
        // CURRENT CAMERA
        // =====================================================

        this.camera =
            this.perspectiveCamera;


        // =====================================================
        // SCENE MANAGER
        // =====================================================

        this.sceneManager =
            new SceneManager(
                this.scene
            );


        // =====================================================
        // INTERACTION
        // =====================================================

        this.interaction =
            new Interaction(
                this.camera,
                this.scene,
                this.renderer.domElement
            );


        // =====================================================
        // LOAD LANDING SCENE
        // =====================================================

        this.loadScenes();


        // =====================================================
        // EVENTS
        // =====================================================

        this.bindEvents();


        // =====================================================
        // RESIZE
        // =====================================================

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );


        // =====================================================
        // FULLSCREEN VIEWPORT
        // =====================================================

        this.setupFullscreenViewport();

    }


    // =========================================================
    // FULLSCREEN VIEWPORT
    // =========================================================

    setupFullscreenViewport(){

        const html =
            document.documentElement;

        const body =
            document.body;

        const appElement =
            document.getElementById(
                "app"
            );


        // -----------------------------------------------------
        // HTML
        // -----------------------------------------------------

        if(html){

            html.style.width =
                "100%";

            html.style.height =
                "100%";

            html.style.margin =
                "0";

            html.style.padding =
                "0";

            html.style.overflow =
                "hidden";

        }


        // -----------------------------------------------------
        // BODY
        // -----------------------------------------------------

        if(body){

            body.style.width =
                "100%";

            body.style.height =
                "100%";

            body.style.margin =
                "0";

            body.style.padding =
                "0";

            body.style.overflow =
                "hidden";

        }


        // -----------------------------------------------------
        // APP
        // -----------------------------------------------------

        if(appElement){

            appElement.style.position =
                "fixed";

            appElement.style.left =
                "0";

            appElement.style.top =
                "0";

            appElement.style.width =
                "100vw";

            appElement.style.height =
                "100vh";

            appElement.style.margin =
                "0";

            appElement.style.padding =
                "0";

            appElement.style.overflow =
                "hidden";

        }


        // -----------------------------------------------------
        // CANVAS
        // -----------------------------------------------------

        if(this.renderer?.domElement){

            const canvas =
                this.renderer.domElement;


            canvas.style.position =
                "fixed";

            canvas.style.left =
                "0";

            canvas.style.top =
                "0";

            canvas.style.width =
                "100vw";

            canvas.style.height =
                "100vh";

            canvas.style.display =
                "block";

            canvas.style.margin =
                "0";

            canvas.style.padding =
                "0";

            canvas.style.border =
                "0";

        }

    }


    // =========================================================
    // CAMERA
    // =========================================================

    createCamera(){

        this.perspectiveCamera =
            new THREE.PerspectiveCamera(

                52,

                window.innerWidth /
                window.innerHeight,

                0.1,

                2000

            );


        this.perspectiveCamera.position.set(
            0,
            4,
            7
        );


        this.perspectiveCamera.lookAt(
            0,
            0,
            0
        );

    }


    // =========================================================
    // RENDERER
    // =========================================================

    createRenderer(){

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                alpha: false

            });


        this.renderer.setPixelRatio(

            Math.min(
                window.devicePixelRatio,
                2
            )

        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;


        this.renderer.toneMappingExposure =
            1.0;


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        const appElement =
            document.getElementById(
                "app"
            );


        if(!appElement){

            console.error(
                "APP ELEMENT NOT FOUND"
            );

            return;

        }


        appElement.appendChild(
            this.renderer.domElement
        );


        // -----------------------------------------------------
        // Canvas
        // -----------------------------------------------------

        const canvas =
            this.renderer.domElement;


        canvas.style.position =
            "fixed";

        canvas.style.left =
            "0";

        canvas.style.top =
            "0";

        canvas.style.width =
            "100vw";

        canvas.style.height =
            "100vh";

        canvas.style.display =
            "block";

        canvas.style.margin =
            "0";

        canvas.style.padding =
            "0";

        canvas.style.border =
            "0";

    }


    // =========================================================
    // LOAD SCENES
    // =========================================================

    loadScenes(){

        this.landing =
            new LandingScene(
                this.events
            );


        this.sceneManager.register(
            "landing",
            this.landing
        );

    }


    // =========================================================
    // REGISTER INTERACTION
    // =========================================================

    registerInteraction(scene){

        if(
            !scene ||
            !scene.getInteractiveObjects
        ){

            console.warn(
                "NO INTERACTION OBJECT",
                scene
            );

            return;

        }


        const objects =
            scene.getInteractiveObjects();


        if(!objects){

            return;

        }


        objects.forEach(
            object => {

                if(object){

                    this.interaction.add(
                        object
                    );

                }

            }
        );

    }


    // =========================================================
    // EVENTS
    // =========================================================

    bindEvents(){

        // -----------------------------------------------------
        // Landing Scene
        // -----------------------------------------------------

        this.events.on(
            "landing",
            () => {

                this.interaction.clear();

                this.sceneManager.show(
                    "landing"
                );

                this.registerInteraction(
                    this.landing
                );

            }
        );

    }


    // =========================================================
    // START
    // =========================================================

    start(){

        this.scene.background =
            this.backgroundColor;


        this.camera =
            this.perspectiveCamera;


        this.interaction.camera =
            this.camera;


        this.sceneManager.show(
            "landing"
        );


        this.registerInteraction(
            this.landing
        );


        this.setupFullscreenViewport();


        this.resize();


        this.animate();

    }


    // =========================================================
    // ANIMATE
    // =========================================================

    animate(){

        requestAnimationFrame(
            () => {

                this.animate();

            }
        );


        const delta =
            this.clock.getDelta();


        this.sceneManager.update(
            delta
        );


        this.renderer.render(
            this.scene,
            this.camera
        );

    }


    // =========================================================
    // RESIZE
    // =========================================================

    resize(){

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        if(
            width <= 0 ||
            height <= 0
        ){

            return;

        }


        // -----------------------------------------------------
        // Renderer
        // -----------------------------------------------------

        this.renderer.setSize(
            width,
            height,
            false
        );


        // -----------------------------------------------------
        // Canvas
        // -----------------------------------------------------

        if(this.renderer.domElement){

            const canvas =
                this.renderer.domElement;


            canvas.style.position =
                "fixed";

            canvas.style.left =
                "0";

            canvas.style.top =
                "0";

            canvas.style.width =
                "100vw";

            canvas.style.height =
                "100vh";

            canvas.style.display =
                "block";

        }


        // -----------------------------------------------------
        // Perspective Camera
        // -----------------------------------------------------

        if(
            this.perspectiveCamera &&
            this.perspectiveCamera.isPerspectiveCamera
        ){

            this.perspectiveCamera.aspect =
                width /
                height;


            this.perspectiveCamera.updateProjectionMatrix();

        }


        // -----------------------------------------------------
        // Fullscreen
        // -----------------------------------------------------

        this.setupFullscreenViewport();

    }

}