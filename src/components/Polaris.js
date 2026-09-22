import * as THREE from "three";
import { gsap } from "gsap";



export default class Polaris {



    constructor() {

        this.group =
            new THREE.Group();

        this.time = 0;

        this.onClick = null;

        this.hidden = false;

        this.create();

    }



    // =========================================================
    // CREATE
    // =========================================================

    create() {


        // =====================================================
        // 北极星
        // =====================================================

        const starShape =
            new THREE.Shape();


        const outerRadius =
            0.16;

        const innerRadius =
            0.04;



        for (

            let i = 0;

            i < 10;

            i++

        ) {

            const angle =
                Math.PI / 5 * i;


            const radius =

                i % 2 === 0

                    ? outerRadius

                    : innerRadius;


            const x =
                Math.cos(angle) * radius;


            const y =
                Math.sin(angle) * radius;



            if (i === 0) {

                starShape.moveTo(x, y);

            } else {

                starShape.lineTo(x, y);

            }

        }


        starShape.closePath();



        const starGeometry =
            new THREE.ShapeGeometry(
                starShape
            );



        const starMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xffffff,

                transparent: true,

                opacity: 1,

                side: THREE.DoubleSide,

                depthWrite: false

            });



        this.star =
            new THREE.Mesh(

                starGeometry,

                starMaterial

            );


        this.star.position.z =
            0.05;


        this.group.add(
            this.star
        );



        // =====================================================
        // 中心光点
        // =====================================================

        const coreGeometry =
            new THREE.SphereGeometry(

                0.005,

                16,

                16

            );



        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xffffff,

                transparent: true,

                opacity: 1

            });



        this.core =
            new THREE.Mesh(

                coreGeometry,

                coreMaterial

            );


        this.core.position.z =
            0.08;


        this.group.add(
            this.core
        );



        // =====================================================
        // 内层星环
        // =====================================================

        const ringGeometry =
            new THREE.RingGeometry(

                0.22,

                0.235,

                48

            );



        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x9fd4ff,

                transparent: true,

                opacity: 0.65,

                side: THREE.DoubleSide,

                depthWrite: false

            });



        this.ring =
            new THREE.Mesh(

                ringGeometry,

                ringMaterial

            );


        this.ring.position.z =
            0.02;


        this.group.add(
            this.ring
        );



        // =====================================================
        // 外层淡光环
        // =====================================================

        const outerRingGeometry =
            new THREE.RingGeometry(

                0.31,

                0.316,

                48

            );



        const outerRingMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xb8dcff,

                transparent: true,

                opacity: 0.22,

                side: THREE.DoubleSide,

                depthWrite: false

            });



        this.outerRing =
            new THREE.Mesh(

                outerRingGeometry,

                outerRingMaterial

            );


        this.outerRing.position.z =
            0.01;


        this.group.add(
            this.outerRing
        );



        // =====================================================
        // 最外层柔和发光圈
        //
        // 原来：
        //
        // SphereGeometry
        //
        // 会产生比较明显的球体边缘。
        //
        // 现在改成：
        //
        // ShaderMaterial
        //
        // 中心亮
        // ↓
        // 向外逐渐变淡
        // ↓
        // 边缘几乎完全透明
        //
        // 这样不会再看到一个明显的圆形边界。
        // =====================================================

        const glowGeometry =
            new THREE.PlaneGeometry(

                0.9,

                0.9

            );



        const glowMaterial =
            new THREE.ShaderMaterial({

                uniforms: {

                    uColor: {

                        value:
                            new THREE.Color(
                                0xd6c7ff
                            )

                    },

                    uOpacity: {

                        value:
                            0.42

                    }

                },

                vertexShader: `

                    varying vec2 vUv;

                    void main() {

                        vUv = uv;

                        gl_Position =
                            projectionMatrix *
                            modelViewMatrix *
                            vec4(
                                position,
                                1.0
                            );

                    }

                `,

                fragmentShader: `

                    uniform vec3 uColor;

                    uniform float uOpacity;

                    varying vec2 vUv;



                    void main() {

                        // =====================================
                        // 计算距离中心的距离
                        // =====================================

                        vec2 center =
                            vec2(
                                0.5,
                                0.5
                            );


                        float distanceFromCenter =
                            distance(
                                vUv,
                                center
                            );



                        // =====================================
                        // 柔和衰减
                        //
                        // 中心：
                        // 1
                        //
                        // 外围：
                        // 0
                        // =====================================

                        float glow =
                            1.0 -
                            smoothstep(

                                0.0,

                                0.5,

                                distanceFromCenter

                            );



                        // =====================================
                        // 再次压低边缘
                        //
                        // 让外缘更自然
                        // =====================================

                        glow =
                            pow(

                                glow,

                                2.2

                            );



                        // =====================================
                        // 最终透明度
                        // =====================================

                        float alpha =
                            glow *
                            uOpacity;



                        // =====================================
                        // 完全透明区域直接丢弃
                        // =====================================

                        if(alpha < 0.005){

                            discard;

                        }



                        gl_FragColor =
                            vec4(

                                uColor,

                                alpha

                            );

                    }

                `,

                transparent: true,

                depthWrite: false,

                depthTest: false,

                blending:
                    THREE.AdditiveBlending

            });



        this.glow =
            new THREE.Mesh(

                glowGeometry,

                glowMaterial

            );



        this.glow.position.z =
            -0.01;



        this.group.add(
            this.glow
        );



        // =====================================================
        // 点击范围
        // =====================================================

        const hitGeometry =
            new THREE.SphereGeometry(

                0.6,

                16,

                16

            );



        const hitMaterial =
            new THREE.MeshBasicMaterial({

                transparent: true,

                opacity: 0,

                depthWrite: false

            });



        const hitArea =
            new THREE.Mesh(

                hitGeometry,

                hitMaterial

            );



        this.hitArea =
            hitArea;



        hitArea.userData.onClick = () => {

            console.log(
                "Polaris clicked"
            );



            if (

                this.onClick &&

                !this.hidden

            ) {

                this.onClick();

            }

        };



        this.group.add(
            hitArea
        );



        // =====================================================
        // 北极星位置
        // =====================================================

        this.group.position.set(

            0,

            -1,

            0

        );

    }



    // =========================================================
    // SET CLICK
    //
    // LandingScene 会调用这个方法
    // =========================================================

    setClick(callback) {

        this.onClick =
            callback;

    }



    // =========================================================
    // HIDE
    //
    // 北极星淡出
    // =========================================================

    hide(callback) {


        if (this.hidden) {

            callback?.();

            return;

        }


        this.hidden = true;



        // =====================================================
        // 禁止点击
        // =====================================================

        if (this.hitArea) {

            this.hitArea.userData.onClick =
                null;

        }



        // =====================================================
        // 普通材质
        // =====================================================

        const targets = [

            this.star?.material,

            this.core?.material,

            this.ring?.material,

            this.outerRing?.material

        ].filter(Boolean);



        gsap.to(

            targets,

            {

                opacity: 0,

                duration: 0.8,

                ease: "power2.inOut"

            }

        );



        // =====================================================
        // Shader 光晕
        //
        // ShaderMaterial 没有 material.opacity
        //
        // 所以需要控制 uniform
        // =====================================================

        if (

            this.glow &&

            this.glow.material &&

            this.glow.material.uniforms &&

            this.glow.material.uniforms.uOpacity

        ) {

            gsap.to(

                this.glow.material.uniforms.uOpacity,

                {

                    value: 0,

                    duration: 0.8,

                    ease: "power2.inOut",

                    onComplete: () => {

                        callback?.();

                    }

                }

            );

        } else {

            callback?.();

        }

    }



    // =========================================================
    // UPDATE
    // =========================================================

    update(delta) {


        if (this.hidden) {

            return;

        }


        this.time += delta;



        // =====================================================
        // 光晕呼吸
        // =====================================================

        const scale =

            1 +

            Math.sin(
                this.time * 3
            )

            * 0.15;



        this.glow.scale.set(

            scale,

            scale,

            scale

        );



        // =====================================================
        // 北极星轻微呼吸
        // =====================================================

        const starScale =

            1 +

            Math.sin(
                this.time * 3
            )

            * 0.04;



        this.star.scale.set(

            starScale,

            starScale,

            starScale

        );



        this.core.scale.set(

            starScale,

            starScale,

            starScale

        );



        // =====================================================
        // 内层星环旋转
        // =====================================================

        if (this.ring) {

            this.ring.rotation.z +=
                delta * 0.12;

        }



        // =====================================================
        // 外层星环旋转
        // =====================================================

        if (this.outerRing) {

            this.outerRing.rotation.z -=
                delta * 0.035;

        }

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

        // =====================================================
        // Geometry
        // =====================================================

        if (this.star?.geometry) {

            this.star.geometry.dispose();

        }



        if (this.core?.geometry) {

            this.core.geometry.dispose();

        }



        if (this.ring?.geometry) {

            this.ring.geometry.dispose();

        }



        if (this.outerRing?.geometry) {

            this.outerRing.geometry.dispose();

        }



        if (this.glow?.geometry) {

            this.glow.geometry.dispose();

        }



        if (this.hitArea?.geometry) {

            this.hitArea.geometry.dispose();

        }



        // =====================================================
        // Material
        // =====================================================

        if (this.star?.material) {

            this.star.material.dispose();

        }



        if (this.core?.material) {

            this.core.material.dispose();

        }



        if (this.ring?.material) {

            this.ring.material.dispose();

        }



        if (this.outerRing?.material) {

            this.outerRing.material.dispose();

        }



        if (this.glow?.material) {

            this.glow.material.dispose();

        }



        if (this.hitArea?.material) {

            this.hitArea.material.dispose();

        }



        this.group.clear();

    }

}