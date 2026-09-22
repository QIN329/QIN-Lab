import * as THREE from "three";

/**
 * ============================================================
 * QIN LAB · HOME V3
 * CINEMATIC LIGHTING
 *
 * 光照原则：
 *
 * 暖太阳
 * +
 * 冷天空
 * =
 * 自然摄影感
 *
 * 不使用夸张彩色光。
 * ============================================================
 */

export default class Lighting {

    constructor() {

        this.group =
            new THREE.Group();

        this.create();

    }


    // =========================================================
    // CREATE
    // =========================================================

    create() {

        this.createSun();

        this.createSkyLight();

        this.createFill();

    }


    // =========================================================
    // SUN
    // =========================================================

    createSun() {

        this.sun =
            new THREE.DirectionalLight(

                0xffd3a0,

                3.2

            );


        this.sun.position.set(

            -18,
            25,
            12

        );


        this.sun.castShadow =
            true;


        // -----------------------------------------------------
        // SHADOW
        // -----------------------------------------------------

        const shadow =
            this.sun.shadow;


        shadow.mapSize.width =
            2048;


        shadow.mapSize.height =
            2048;


        shadow.camera.near =
            1;


        shadow.camera.far =
            80;


        shadow.camera.left =
            -30;


        shadow.camera.right =
            30;


        shadow.camera.top =
            30;


        shadow.camera.bottom =
            -30;


        shadow.bias =
            -0.00015;


        shadow.normalBias =
            0.025;


        this.group.add(
            this.sun
        );

    }


    // =========================================================
    // SKY LIGHT
    // =========================================================

    createSkyLight() {

        this.skyLight =
            new THREE.HemisphereLight(

                0x9fcff0,

                0x66503d,

                1.45

            );


        this.skyLight.position.set(

            0,
            20,
            0

        );


        this.group.add(
            this.skyLight
        );

    }


    // =========================================================
    // FILL
    // =========================================================

    createFill() {

        this.fill =
            new THREE.DirectionalLight(

                0xa9c9df,

                0.42

            );


        this.fill.position.set(

            12,
            8,
            -16

        );


        this.group.add(
            this.fill
        );

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update() {

        // 光照暂时保持稳定。
        //
        // 后续可以实现：
        //
        // 早晨
        // 中午
        // 黄昏
        // 夜晚

    }


    // =========================================================
    // OBJECT
    // =========================================================

    getObject() {

        return this.group;

    }


    // =========================================================
    // DISPOSE
    // =========================================================

    dispose() {

        this.group.traverse(
            object => {

                if (
                    object.isLight
                ) {

                    object.dispose?.();

                }

            }
        );


        this.group.clear();

    }

}