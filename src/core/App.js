import * as THREE from "three";

import EventBus from "./EventBus.js";
import SceneManager from "./SceneManager.js";
import Interaction from "./Interaction.js";

import LandingScene from "../scenes/LandingScene.js";
import HomeScene from "../scenes/HomeScene.js";
import RoomScene from "../scenes/RoomScene.js";

import Transition from "../effects/Transition.js";


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

        this.backgroundTime = 0;



        // =====================================================
        // EVENT BUS
        // =====================================================

        this.events =
            new EventBus();



        // =====================================================
        // CAMERA SYSTEM
        //
        // Landing:
        // Perspective Camera
        //
        // Home:
        // Orthographic Camera
        //
        // Room:
        // Perspective Camera
        //
        // =====================================================

        this.createCamera();



        // =====================================================
        // RENDERER
        // =====================================================

        this.createRenderer();



        // =====================================================
        // CURRENT CAMERA
        // 默认 Landing
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
        // TRANSITION
        // =====================================================

        this.transition =
            new Transition(
                this.camera
            );



        // =====================================================
        // ROOM ROTATION
        // =====================================================

        this.isRoomDragging =
            false;

        this.previousMouseX =
            0;

        this.previousMouseY =
            0;

        this.roomRotationY =
            0;

        this.roomRotationX =
            0;



        // =====================================================
        // LOAD SCENES
        // =====================================================

        this.loadScenes();



        // =====================================================
        // EVENTS
        // =====================================================

        this.bindEvents();



        // =====================================================
        // ROOM CONTROL
        // =====================================================

        this.bindRoomControls();

        this.bindRoomZoom();



        // =====================================================
        // RESIZE
        // =====================================================

        window.addEventListener(
            "resize",
            ()=>{
                this.resize();
            }
        );


        // =====================================================
        // FULLSCREEN VIEWPORT
        //
        // 确保网站永远锁定在浏览器视口。
        // 防止浏览器默认 margin、
        // #app 尺寸以及 Canvas 的 inline 布局
        // 导致页面出现横向溢出。
        // =====================================================

        this.setupFullscreenViewport();

    }



    // =====================================================
    // FULLSCREEN VIEWPORT
    // =====================================================

    setupFullscreenViewport(){

        const html =
            document.documentElement;

        const body =
            document.body;

        const appElement =
            document.getElementById(
                "app"
            );


        // ---------------------------------------------
        // HTML
        // ---------------------------------------------

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


        // ---------------------------------------------
        // BODY
        // ---------------------------------------------

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


        // ---------------------------------------------
        // APP
        // ---------------------------------------------

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


        // ---------------------------------------------
        // CANVAS
        // ---------------------------------------------

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



    // =====================================================
    // CAMERA SYSTEM
    // =====================================================

    createCamera(){


        // =================================================
        // 3D CAMERA
        // =================================================

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



        // =================================================
        // UI CAMERA
        // =================================================

        const aspect =
            window.innerWidth /
            window.innerHeight;


        this.uiCamera =
            new THREE.OrthographicCamera(

                -aspect,
                aspect,

                1,
                -1,

                0.1,
                10

            );


        this.uiCamera.position.z =
            5;


        this.uiCamera.lookAt(
            0,
            0,
            0
        );

    }



    // =====================================================
    // CAMERA SWITCH
    // =====================================================

    switchCamera(type){


        if(type === "ui"){

            this.camera =
                this.uiCamera;

        }

        else{

            this.camera =
                this.perspectiveCamera;

        }


        this.interaction.camera =
            this.camera;


        this.transition.camera =
            this.camera;

    }



    // =====================================================
    // RENDERER
    // =====================================================

    createRenderer(){


        this.renderer =
            new THREE.WebGLRenderer({

                antialias:true,

                alpha:false

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


        // =================================================
        // Canvas 全屏固定
        // =================================================

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



    // =====================================================
    // LOAD SCENES
    // =====================================================

    loadScenes(){


        this.landing =
            new LandingScene(
                this.events
            );


        this.home =
            new HomeScene(
                this.events
            );


        this.room =
            new RoomScene(
                this.events
            );


        this.sceneManager.register(
            "landing",
            this.landing
        );


        this.sceneManager.register(
            "home",
            this.home
        );


        this.sceneManager.register(
            "room",
            this.room
        );

    }



    // =====================================================
    // REGISTER INTERACTION
    // =====================================================

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


        objects.forEach(
            object=>{

                if(object){

                    this.interaction.add(
                        object
                    );

                }

            }
        );

    }



    // =====================================================
    // ROOM UI CONTROL
    //
    // 这个部分非常重要。
    //
    // Room01 内部拥有 DOM UI，
    // 但 UI 的显示生命周期必须跟着 Room Scene。
    //
    // Landing / Home:
    // 隐藏
    //
    // Room:
    // 显示
    //
    // =====================================================

    hideRoomUI(){

        try{

            // ---------------------------------------------
            // RoomScene 当前房间
            // ---------------------------------------------

            const currentRoom =
                this.room?.currentRoom;


            if(currentRoom){

                if(
                    typeof currentRoom.hide ===
                    "function"
                ){

                    currentRoom.hide();

                }


                if(
                    typeof currentRoom.hideUI ===
                    "function"
                ){

                    currentRoom.hideUI();

                }


                if(
                    typeof currentRoom.setUIVisible ===
                    "function"
                ){

                    currentRoom.setUIVisible(
                        false
                    );

                }

            }


            // ---------------------------------------------
            // 保险措施：
            // 如果旧版本 DOM 已经存在，
            // 直接强制隐藏。
            // ---------------------------------------------

            const panel =
                document.getElementById(
                    "room01-ui-panel"
                );


            if(panel){

                panel.style.display =
                    "none";

            }

        }

        catch(error){

            console.warn(
                "ROOM UI HIDE ERROR:",
                error
            );

        }

    }



    showRoomUI(){

        try{

            const currentRoom =
                this.room?.currentRoom;


            if(currentRoom){

                if(
                    typeof currentRoom.show ===
                    "function"
                ){

                    currentRoom.show();

                }


                if(
                    typeof currentRoom.showUI ===
                    "function"
                ){

                    currentRoom.showUI();

                }


                if(
                    typeof currentRoom.setUIVisible ===
                    "function"
                ){

                    currentRoom.setUIVisible(
                        true
                    );

                }

            }


            const panel =
                document.getElementById(
                    "room01-ui-panel"
                );


            if(panel){

                panel.style.display =
                    "flex";

            }

        }

        catch(error){

            console.warn(
                "ROOM UI SHOW ERROR:",
                error
            );

        }

    }



    // =====================================================
    // EVENTS
    // =====================================================

    bindEvents(){


        // =================================================
        // ENTER HOME
        // =================================================

        this.events.on(

            "enter-home",

            ()=>{


                console.log(
                    "ENTER HOME EVENT"
                );


                // ---------------------------------------------
                // 进入 Home 前先关闭 Room UI
                // ---------------------------------------------

                this.hideRoomUI();


                this.transition.play(

                    ()=>{


                        this.interaction.clear();


                        this.sceneManager.show(
                            "home"
                        );


                        // -----------------------------------------
                        // HOME 使用 UI CAMERA
                        // -----------------------------------------

                        this.switchCamera(
                            "ui"
                        );


                        this.setHomeEnvironment();


                        this.registerInteraction(
                            this.home
                        );

                    }

                );

            }

        );



        // =================================================
        // OPEN ROOM
        // =================================================

        this.events.on(

            "open-room",

            (id)=>{


                console.log(
                    "OPEN ROOM EVENT",
                    id
                );


                // ---------------------------------------------
                // 在真正进入 Room 之前，
                // 先强制隐藏 Room UI。
                //
                // 这样可以保证：
                //
                // Polaris
                // ↓
                // Transition
                // ↓
                // Room
                // ↓
                // 才出现 UI
                // ---------------------------------------------

                this.hideRoomUI();


                this.transition.play(

                    ()=>{


                        this.interaction.clear();


                        this.sceneManager.show(
                            "room"
                        );


                        // -----------------------------------------
                        // ROOM 继续使用 Perspective Camera
                        //
                        // 北极星页面完全不改变
                        // -----------------------------------------

                        this.switchCamera(
                            "perspective"
                        );


                        this.setRoomEnvironment();


                        // -----------------------------------------
                        // 打开指定房间
                        // -----------------------------------------

                        this.room.open(
                            "room0" + id
                        );


                        this.registerInteraction(
                            this.room
                        );


                        // -----------------------------------------
                        // ROOM ROTATION RESET
                        // -----------------------------------------

                        this.roomRotationY =
                            0;


                        this.roomRotationX =
                            0;


                        this.applyRoomRotation();


                        // -----------------------------------------
                        // 最后才显示 Room UI
                        //
                        // 注意：
                        // 只有已经进入 Room 后才执行。
                        // -----------------------------------------

                        requestAnimationFrame(

                            ()=>{

                                if(
                                    this.isRoomScene()
                                ){

                                    this.showRoomUI();

                                }

                            }

                        );

                    }

                );

            }

        );

    }



    // =====================================================
    // HOME ENVIRONMENT
    // =====================================================

    setHomeEnvironment(){


        this.scene.fog =
            null;


        this.backgroundColor.set(
            0xffffff
        );


        this.scene.background =
            this.backgroundColor;


        this.renderer.toneMappingExposure =
            1.0;

    }



    // =====================================================
    // LANDING ENVIRONMENT
    // =====================================================

    setLandingEnvironment(){


        // ---------------------------------------------
        // 离开 Room 时关闭 Room UI
        // ---------------------------------------------

        this.hideRoomUI();


        this.scene.fog =
            null;


        this.backgroundColor.set(
            0x050816
        );


        this.scene.background =
            this.backgroundColor;


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


        this.perspectiveCamera.fov =
            55;


        this.perspectiveCamera.updateProjectionMatrix();


        this.renderer.toneMappingExposure =
            1.0;

    }



    // =====================================================
    // ROOM ENVIRONMENT
    // =====================================================

    setRoomEnvironment(){


        this.scene.fog =
            null;


        this.scene.background =
            new THREE.Color(
                0xd7bfa2
            );


        this.perspectiveCamera.fov =
            55;


        this.perspectiveCamera.updateProjectionMatrix();


        this.renderer.toneMappingExposure =
            1.15;

    }



    // =====================================================
    // ROOM MOUSE CONTROL
    //
    // ROOM 页面继续允许鼠标旋转
    //
    // =====================================================

    bindRoomControls(){


        const canvas =
            this.renderer.domElement;


        canvas.addEventListener(

            "pointerdown",

            (event)=>{


                if(
                    !this.isRoomScene()
                ){

                    return;

                }


                this.isRoomDragging =
                    true;


                this.previousMouseX =
                    event.clientX;


                this.previousMouseY =
                    event.clientY;


                canvas.style.cursor =
                    "grabbing";

            }

        );


        window.addEventListener(

            "pointermove",

            (event)=>{


                if(
                    !this.isRoomDragging
                ){

                    return;

                }


                if(
                    !this.isRoomScene()
                ){

                    return;

                }


                const deltaX =
                    event.clientX -
                    this.previousMouseX;


                const deltaY =
                    event.clientY -
                    this.previousMouseY;


                this.previousMouseX =
                    event.clientX;


                this.previousMouseY =
                    event.clientY;


                this.roomRotationY +=
                    deltaX * 0.005;


                this.roomRotationX +=
                    deltaY * 0.003;


                this.roomRotationX =
                    THREE.MathUtils.clamp(

                        this.roomRotationX,

                        -0.35,

                        0.35

                    );


                this.applyRoomRotation();

            }

        );


        window.addEventListener(

            "pointerup",

            ()=>{


                this.isRoomDragging =
                    false;


                canvas.style.cursor =
                    "default";

            }

        );

    }



    // =====================================================
    // ROOM CAMERA ZOOM
    //
    // 鼠标滚轮：
    //
    // 上滚 = 放大
    // 下滚 = 缩小
    //
    // 只允许 Room 使用
    //
    // =====================================================

    bindRoomZoom(){


        const canvas =
            this.renderer.domElement;


        canvas.addEventListener(

            "wheel",

            (event)=>{


                if(
                    !this.isRoomScene()
                ){

                    return;

                }


                event.preventDefault();


                const camera =
                    this.perspectiveCamera;


                // ---------------------------------------------
                // 放大
                // ---------------------------------------------

                if(
                    event.deltaY < 0
                ){

                    camera.position.z -=
                        0.6;

                }


                // ---------------------------------------------
                // 缩小
                // ---------------------------------------------

                else{

                    camera.position.z +=
                        0.6;

                }


                // ---------------------------------------------
                // 限制距离
                // ---------------------------------------------

                camera.position.z =
                    THREE.MathUtils.clamp(

                        camera.position.z,

                        3,

                        14

                    );


                camera.lookAt(
                    0,
                    0,
                    0
                );

            },

            {
                passive:false
            }

        );

    }



    // =====================================================
    // IS ROOM
    // =====================================================

    isRoomScene(){


        return (

            this.sceneManager.current ===
            this.room

        );

    }



    // =====================================================
    // APPLY ROOM ROTATION
    // =====================================================

    applyRoomRotation(){


        if(!this.room){

            return;

        }


        const object =
            this.room.getObject?.();


        if(!object){

            return;

        }


        object.rotation.y =
            this.roomRotationY;


        object.rotation.x =
            this.roomRotationX;

    }



    // =====================================================
    // LANDING BACKGROUND
    // =====================================================

    updateBackground(delta){


        if(

            this.sceneManager.current !==
            this.landing

        ){

            return;

        }


        this.backgroundTime +=
            delta;


        const t =
            this.backgroundTime * 0.35;


        const a =
            (
                Math.sin(t) + 1
            ) / 2;


        const b =
            (
                Math.sin(
                    t * 0.55 + 1.5
                ) + 1
            ) / 2;


        const c =
            (
                Math.sin(
                    t * 0.25 + 3
                ) + 1
            ) / 2;


        const color1 =
            new THREE.Color(
                0x030611
            );


        const color2 =
            new THREE.Color(
                0x07152d
            );


        const color3 =
            new THREE.Color(
                0x102f52
            );


        const temp =
            new THREE.Color();


        temp.lerpColors(
            color1,
            color2,
            a
        );


        this.backgroundColor.lerpColors(
            temp,
            color3,
            b * 0.2
        );


        this.scene.background =
            this.backgroundColor;

    }



    // =====================================================
    // START
    // =====================================================

    start(){


        // ---------------------------------------------
        // 启动时确保 Room UI 隐藏
        // ---------------------------------------------

        this.hideRoomUI();


        this.setLandingEnvironment();


        this.switchCamera(
            "perspective"
        );


        this.sceneManager.show(
            "landing"
        );


        this.registerInteraction(
            this.landing
        );


        // ---------------------------------------------
        // 再次确保整个网站铺满视口
        // ---------------------------------------------

        this.setupFullscreenViewport();


        this.resize();


        this.animate();

    }



    // =====================================================
    // ANIMATE
    // =====================================================

    animate(){


        requestAnimationFrame(
            ()=>{
                this.animate();
            }
        );


        const delta =
            this.clock.getDelta();


        this.updateBackground(
            delta
        );


        this.sceneManager.update(
            delta
        );


        this.renderer.render(
            this.scene,
            this.camera
        );

    }



    // =====================================================
    // RESIZE
    // =====================================================

    resize(){


        const width =
            window.innerWidth;


        const height =
            window.innerHeight;


        // =================================================
        // 防止异常尺寸
        // =================================================

        if(
            width <= 0 ||
            height <= 0
        ){

            return;

        }



        // =================================================
        // Renderer
        // =================================================

        this.renderer.setSize(
            width,
            height,
            false
        );



        // =================================================
        // Canvas
        // =================================================

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



        // =================================================
        // Perspective Camera
        // =================================================

        if(
            this.perspectiveCamera
                .isPerspectiveCamera
        ){

            this.perspectiveCamera.aspect =
                width /
                height;


            this.perspectiveCamera
                .updateProjectionMatrix();

        }



        // =================================================
        // UI Camera
        // =================================================

        if(
            this.uiCamera
                .isOrthographicCamera
        ){

            const aspect =
                width /
                height;


            this.uiCamera.left =
                -aspect;


            this.uiCamera.right =
                aspect;


            this.uiCamera.top =
                1;


            this.uiCamera.bottom =
                -1;


            this.uiCamera
                .updateProjectionMatrix();

        }



        // =================================================
        // 最后再次锁定 DOM 视口
        // =================================================

        this.setupFullscreenViewport();

    }

}