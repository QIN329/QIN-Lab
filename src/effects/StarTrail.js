import * as THREE from "three";
import gsap from "gsap";

export default class StarTrail {

    constructor() {

        this.group =
            new THREE.Group();

        // =====================================================
        // 参数
        // =====================================================

        this.center =
            new THREE.Vector3(
                0,
                0,
                0
            );

        this.trailCount = 42;

        this.starsPerTrail = 88;

        this.minRadius = 1;

        this.maxRadius = 18;

        this.yScale = 0.3;

        this.length = 5.5;

        this.curve = 1.8;

        this.rotationSpeed = 0.0018;

        this.variation = 0.35;

        this.starSize = 0.01;

        this.opacity = 0.72;

        this.started = false;

        this.elapsed = 0;

        this.originalOpacity = this.opacity;

        // =====================================================
        // 创建
        // =====================================================

        this.create();
    }


    // =========================================================
    // CREATE
    // =========================================================

    create() {

        for (
            let i = 0;
            i < this.trailCount;
            i++
        ) {

            this.createTrail(i);

        }

        this.group.visible = true;

        this.group.traverse(
            object => {

                if (
                    object.material &&
                    object.material.opacity !== undefined
                ) {

                    object.material.opacity = 0;

                }

            }
        );
    }


    // =========================================================
    // CREATE TRAIL
    // =========================================================

    createTrail(index) {

        const positions = [];

        const opacities = [];

        const colors = [];

        const baseAngle =
            (
                index /
                this.trailCount
            ) *
            Math.PI *
            2;

        const randomOffset =
            (
                Math.random() -
                0.5
            ) *
            this.variation;

        const angle =
            baseAngle +
            randomOffset;

        for (
            let i = 0;
            i < this.starsPerTrail;
            i++
        ) {

            const progress =
                i /
                (
                    this.starsPerTrail -
                    1
                );

            // 半径由内向外
            const radius =
                THREE.MathUtils.lerp(
                    this.minRadius,
                    this.maxRadius,
                    progress
                );

            // =================================================
            // 弯曲
            // =================================================

            const bend =
                Math.pow(
                    progress,
                    this.curve
                ) *
                this.length;

            const localAngle =
                angle +
                bend * 0.035;

            let x =
                Math.cos(localAngle) *
                radius;

            let z =
                Math.sin(localAngle) *
                radius;

            // =================================================
            // 椭圆
            // =================================================

            let y =
                Math.sin(
                    localAngle * 1.7
                ) *
                radius *
                this.yScale;

            // 微小随机
            x +=
                (
                    Math.random() -
                    0.5
                ) *
                this.variation;

            y +=
                (
                    Math.random() -
                    0.5
                ) *
                this.variation *
                0.35;

            z +=
                (
                    Math.random() -
                    0.5
                ) *
                this.variation;

            positions.push(
                x,
                y,
                z
            );

            // =================================================
            // 星星亮度
            // =================================================

            const edgeFade =
                Math.sin(
                    progress *
                    Math.PI
                );

            const randomOpacity =
                0.45 +
                Math.random() *
                0.55;

            opacities.push(
                edgeFade *
                randomOpacity
            );

            colors.push(
                1,
                1,
                1
            );
        }

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );

        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(
                colors,
                3
            )
        );

        // =====================================================
        // 使用 Points
        // =====================================================

        const material =
            new THREE.PointsMaterial({

                color: 0xffffff,

                size: this.starSize,

                transparent: true,

                opacity: 0,

                vertexColors: true,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending,

                sizeAttenuation: true

            });

        const points =
            new THREE.Points(
                geometry,
                material
            );

        points.userData.baseOpacity =
            this.opacity;

        points.userData.index =
            index;

        points.userData.angle =
            angle;

        this.group.add(
            points
        );
    }


    // =========================================================
    // PLAY
    // =========================================================

    play() {

        if (this.started) {
            return;
        }

        this.started = true;

        const children =
            this.group.children;

        children.forEach(
            (child, index) => {

                const delay =
                    index *
                    0.012;

                gsap.to(
                    child.material,
                    {
                        opacity:
                            child.userData
                                .baseOpacity,

                        duration: 1.4,

                        delay,

                        ease:
                            "power2.out"
                    }
                );

            }
        );
    }


    // =========================================================
    // STOP
    // =========================================================

    stop() {

        this.started = false;

        this.group.children.forEach(
            child => {

                gsap.to(
                    child.material,
                    {
                        opacity: 0,

                        duration: 0.6,

                        ease:
                            "power2.out"
                    }
                );

            }
        );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(delta = 0.016) {

        if (!this.started) {
            return;
        }

        this.elapsed += delta;

        // =====================================================
        // 整体旋转
        // =====================================================

        this.group.rotation.y +=
            this.rotationSpeed;

        // =====================================================
        // 微小上下运动
        // =====================================================

        this.group.position.y =
            Math.sin(
                this.elapsed *
                0.25
            ) *
            0.03;

        // =====================================================
        // 每一条轨迹独立呼吸
        // =====================================================

        this.group.children.forEach(
            (child, index) => {

                if (
                    !child.material
                ) {
                    return;
                }

                const wave =
                    Math.sin(
                        this.elapsed *
                        0.8 +
                        index *
                        0.31
                    );

                const base =
                    child.userData
                        .baseOpacity ||
                    this.opacity;

                const target =
                    base *
                    (
                        0.82 +
                        wave *
                        0.18
                    );

                child.material.opacity +=
                    (
                        target -
                        child.material.opacity
                    ) *
                    Math.min(
                        1,
                        delta * 2
                    );
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
    // DISPOSE
    // =========================================================

    dispose() {

        this.group.traverse(
            object => {

                if (object.geometry) {

                    object.geometry.dispose();

                }

                if (object.material) {

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

                    } else {

                        object.material.dispose();

                    }

                }

            }
        );

        this.group.clear();
    }

}