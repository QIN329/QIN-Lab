import * as THREE from "three";

/**
 * ============================================================
 * QIN LAB · HOME V3
 * TERRAIN SYSTEM
 *
 * 目标：
 * ------------------------------------------------------------
 * 建立自然地形。
 *
 * 不追求大型开放世界。
 * 而是建立一个摄影机可以相信的真实空间。
 *
 * 特点：
 * ------------------------------------------------------------
 * ✔ 缓慢起伏
 * ✔ 中央道路略低
 * ✔ 远处地形抬高
 * ✔ 自然随机
 * ✔ 阴影接收
 * ============================================================
 */

export default class Terrain {

    constructor() {

        this.group =
            new THREE.Group();

        this.width = 48;
        this.depth = 46;

        this.segments = 80;

        this.create();

    }


    // =========================================================
    // CREATE
    // =========================================================

    create() {

        const geometry =
            new THREE.PlaneGeometry(

                this.width,

                this.depth,

                this.segments,

                this.segments

            );


        const position =
            geometry.attributes.position;


        // -----------------------------------------------------
        // 地形高度
        // -----------------------------------------------------

        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i);

            const y =
                position.getY(i);


            // 归一化

            const nx =
                x / this.width;

            const ny =
                y / this.depth;


            // -------------------------------------------------
            // 大尺度地形
            // -------------------------------------------------

            let height =

                Math.sin(
                    nx * Math.PI * 1.4
                ) * 0.35

                +

                Math.sin(
                    ny * Math.PI * 1.7
                ) * 0.28;


            // -------------------------------------------------
            // 第二层起伏
            // -------------------------------------------------

            height +=

                Math.sin(
                    nx * Math.PI * 4.5 +
                    ny * 2.0
                ) * 0.10;


            // -------------------------------------------------
            // 道路区域稍微降低
            // -------------------------------------------------

            const roadDistance =
                Math.abs(
                    x + y * 0.045
                );


            if (
                roadDistance < 1.4
            ) {

                height -=
                    0.10 *
                    (
                        1 -
                        roadDistance / 1.4
                    );

            }


            // -------------------------------------------------
            // 远景抬高
            // -------------------------------------------------

            const distance =
                Math.max(
                    0,
                    -y
                );


            height +=
                Math.pow(
                    distance /
                    this.depth,
                    2
                ) * 0.7;


            position.setZ(
                i,
                height
            );

        }


        position.needsUpdate =
            true;


        geometry.computeVertexNormals();


        // =====================================================
        // MATERIAL
        // =====================================================

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x668653,

                roughness:
                    0.94,

                metalness:
                    0.0,

                side:
                    THREE.FrontSide

            });


        this.terrain =
            new THREE.Mesh(
                geometry,
                material
            );


        this.terrain.rotation.x =
            -Math.PI / 2;


        this.terrain.position.set(
            0,
            -1.55,
            -5
        );


        this.terrain.receiveShadow =
            true;


        this.group.add(
            this.terrain
        );


        // =====================================================
        // SOIL PATH
        // =====================================================

        this.createPath();

    }


    // =========================================================
    // PATH
    // =========================================================

    createPath() {

        const geometry =
            new THREE.PlaneGeometry(
                2.1,
                32,
                20,
                40
            );


        const position =
            geometry.attributes.position;


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i);

            const y =
                position.getY(i);


            const curve =
                Math.sin(
                    y * 0.25
                ) * 0.25;


            position.setX(
                i,
                x + curve
            );

        }


        position.needsUpdate =
            true;


        geometry.computeVertexNormals();


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x9c7652,

                roughness:
                    1.0,

                metalness:
                    0

            });


        this.path =
            new THREE.Mesh(
                geometry,
                material
            );


        this.path.rotation.x =
            -Math.PI / 2;


        this.path.position.set(
            -0.65,
            -1.40,
            -5
        );


        this.path.rotation.z =
            -0.035;


        this.path.receiveShadow =
            true;


        this.group.add(
            this.path
        );

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update() {

        // 当前地形保持静态。
        // 后续可以加入：
        //
        // 雨
        // 积雪
        // 季节
        // 水面
        // 地表湿度

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
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    object.material.dispose();

                }

            }
        );


        this.group.clear();

    }

}