import * as THREE from "three";
import { gsap } from "gsap";

import SpaceBackground from "../effects/SpaceBackground.js";
import Nebula from "../effects/Nebula.js";
import Stars from "../components/Stars.js";
import Polaris from "../components/Polaris.js";
import QinLogo from "../components/QinLogo.js";
import LoveSequence from "../effects/LoveSequence.js";
import StarTrail from "../effects/StarTrail.js";
import ColorController from "../components/ColorController.js";


export default class LandingScene {

    constructor(events) {

        // =====================================================
        // EVENT BUS
        // =====================================================

        this.events =
            events;


        // =====================================================
        // ROOT
        // =====================================================

        this.group =
            new THREE.Group();


        // =====================================================
        // STATE
        // =====================================================

        this.started =
            false;


        // =====================================================
        // COMPONENTS
        // =====================================================

        this.background =
            null;

        this.nebula =
            null;

        this.stars =
            null;

        this.polaris =
            null;

        this.logo =
            null;

        this.love =
            null;

        this.trail =
            null;

        this.colorController =
            null;


        // =====================================================
        // CREATE
        // =====================================================

        this.create();

    }



    // =========================================================
    // CREATE
    // =========================================================

    create() {

        // =====================================================
        // SPACE BACKGROUND
        // =====================================================

        this.background =
            new SpaceBackground();


        this.group.add(
            this.background.getObject()
        );


        // =====================================================
        // NEBULA
        // =====================================================

        this.nebula =
            new Nebula();


        this.group.add(
            this.nebula.getObject()
        );


        // =====================================================
        // COLOR CONTROLLER
        //
        // 隐藏式右上角感应光点
        // =====================================================

        this.colorController =
            new ColorController({

                scene:
                    this.group,

                spaceBackground:
                    this.background,

                nebula:
                    this.nebula

            });


        // =====================================================
        // BACKGROUND STARS
        // =====================================================

        this.stars =
            new Stars();


        this.group.add(
            this.stars.getObject()
        );


        // =====================================================
        // POLARIS
        // =====================================================

        this.polaris =
            new Polaris();


        this.polaris.setClick(
            () => {

                this.begin();

            }
        );


        this.group.add(
            this.polaris.getObject()
        );


        // =====================================================
        // QIN LAB LOGO
        // =====================================================

        this.logo =
            new QinLogo();


        this.group.add(
            this.logo.getObject()
        );


        // =====================================================
        // I LOVE / I KNOW
        // =====================================================

        this.love =
            new LoveSequence();


        this.group.add(
            this.love.getObject()
        );


        // =====================================================
        // STAR TRAIL
        // =====================================================

        this.trail =
            new StarTrail();


        this.group.add(
            this.trail.getObject()
        );

    }



    // =========================================================
    // BEGIN
    // =========================================================

    begin() {

        // -----------------------------------------------------
        // 防止重复触发
        // -----------------------------------------------------

        if (
            this.started
        ) {

            return;

        }


        this.started =
            true;


        // -----------------------------------------------------
        // LOVE SEQUENCE
        // -----------------------------------------------------

        this.love.play(
            () => {

                // =============================================
                // STAR TRAIL
                // =============================================

                this.trail.play();


                // =============================================
                // POLARIS
                // =============================================

                setTimeout(
                    () => {

                        if (
                            this.polaris
                        ) {

                            this.polaris.hide();

                        }

                    },
                    100
                );


                // =============================================
                // LOGO
                // =============================================

                setTimeout(
                    () => {

                        if (
                            this.logo
                        ) {

                            this.logo.show();

                        }

                    },
                    100
                );


                // =============================================
                // ENTER HOME
                // =============================================

                setTimeout(
                    () => {

                        if (
                            this.events
                        ) {

                            this.events.emit(
                                "enter-home"
                            );

                        }

                    },
                    3500
                );

            }
        );

    }



    // =========================================================
    // POLARIS FADE
    // =========================================================

    fadePolaris() {

        if (
            !this.polaris
        ) {

            return;

        }


        if (
            typeof this.polaris.hide ===
            "function"
        ) {

            this.polaris.hide();

            return;

        }


        const object =
            this.polaris.getObject();


        if (
            !object
        ) {

            return;

        }


        object.traverse(
            child => {

                if (
                    child.material &&
                    child.material.transparent !==
                    undefined
                ) {

                    gsap.to(
                        child.material,
                        {

                            opacity:
                                0,

                            duration:
                                this.polarisFadeDuration ||
                                1.2,

                            ease:
                                "power2.inOut"

                        }
                    );

                }

            }
        );

    }



    // =========================================================
    // GET OBJECT
    // =========================================================

    getObject() {

        return this.group;

    }



    // =========================================================
    // GET INTERACTIVE OBJECTS
    // =========================================================

    getInteractiveObjects() {

        if (
            !this.polaris
        ) {

            return [];

        }


        return [
            this.polaris.getObject()
        ];

    }



    // =========================================================
    // START
    // =========================================================

    start() {

        // =====================================================
        // BACKGROUND
        // =====================================================

        if (
            this.background &&
            typeof this.background.update ===
            "function"
        ) {

            this.background.update(
                0
            );

        }


        // =====================================================
        // NEBULA
        // =====================================================

        if (
            this.nebula &&
            typeof this.nebula.start ===
            "function"
        ) {

            this.nebula.start();

        }


        // =====================================================
        // STARS
        // =====================================================

        if (
            this.stars &&
            typeof this.stars.start ===
            "function"
        ) {

            this.stars.start();

        }


        // =====================================================
        // POLARIS
        // =====================================================

        if (
            this.polaris &&
            typeof this.polaris.start ===
            "function"
        ) {

            this.polaris.start();

        }


        // =====================================================
        // COLOR CONTROLLER
        // =====================================================

        if (
            this.colorController &&
            typeof this.colorController.show ===
            "function"
        ) {

            this.colorController.show();

        }


        // =====================================================
        // RESET
        // =====================================================

        this.started =
            false;

    }



    // =========================================================
    // STOP
    // =========================================================

    stop() {

        this.started =
            false;


        if (
            this.nebula &&
            typeof this.nebula.stop ===
            "function"
        ) {

            this.nebula.stop();

        }

    }



    // =========================================================
    // UPDATE
    // =========================================================

    update(delta) {

        // =====================================================
        // SPACE BACKGROUND
        // =====================================================

        if (
            this.background &&
            typeof this.background.update ===
            "function"
        ) {

            this.background.update(
                delta
            );

        }


        // =====================================================
        // NEBULA
        // =====================================================

        if (
            this.nebula &&
            typeof this.nebula.update ===
            "function"
        ) {

            this.nebula.update(
                delta
            );

        }


        // =====================================================
        // STARS
        // =====================================================

        if (
            this.stars &&
            typeof this.stars.update ===
            "function"
        ) {

            this.stars.update(
                delta
            );

        }


        // =====================================================
        // POLARIS
        // =====================================================

        if (
            this.polaris &&
            typeof this.polaris.update ===
            "function"
        ) {

            this.polaris.update(
                delta
            );

        }


        // =====================================================
        // LOVE
        // =====================================================

        if (
            this.love &&
            typeof this.love.update ===
            "function"
        ) {

            this.love.update(
                delta
            );

        }


        // =====================================================
        // STAR TRAIL
        // =====================================================

        if (
            this.trail &&
            typeof this.trail.update ===
            "function"
        ) {

            this.trail.update(
                delta
            );

        }


        // =====================================================
        // COLOR CONTROLLER
        // =====================================================

        if (
            this.colorController &&
            typeof this.colorController.update ===
            "function"
        ) {

            this.colorController.update();

        }

    }



    // =========================================================
    // SHOW
    // =========================================================

    show() {

        this.group.visible =
            true;


        if (
            this.colorController &&
            typeof this.colorController.show ===
            "function"
        ) {

            this.colorController.show();

        }

    }



    // =========================================================
    // HIDE
    // =========================================================

    hide() {

        this.group.visible =
            false;


        if (
            this.colorController &&
            typeof this.colorController.hide ===
            "function"
        ) {

            this.colorController.hide();

        }

    }



    // =========================================================
    // DISPOSE
    // =========================================================

    dispose() {

        // =====================================================
        // COLOR CONTROLLER
        // =====================================================

        if (
            this.colorController &&
            typeof this.colorController.dispose ===
            "function"
        ) {

            this.colorController.dispose();

        }


        // =====================================================
        // NEBULA
        // =====================================================

        if (
            this.nebula &&
            typeof this.nebula.dispose ===
            "function"
        ) {

            this.nebula.dispose();

        }


        // =====================================================
        // THREE OBJECTS
        // =====================================================

        this.group.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    }

                    else {

                        object.material.dispose();

                    }

                }

            }
        );


        // =====================================================
        // CLEAR
        // =====================================================

        this.group.clear();


        // =====================================================
        // NULL
        // =====================================================

        this.background =
            null;

        this.nebula =
            null;

        this.stars =
            null;

        this.polaris =
            null;

        this.logo =
            null;

        this.love =
            null;

        this.trail =
            null;

        this.colorController =
            null;

    }

}