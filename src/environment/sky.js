import * as THREE from "three";

/**
 * ============================================================
 * QIN LAB · HOME V3
 * SKY SYSTEM
 *
 * 目标：
 * ------------------------------------------------------------
 * 不是蓝色背景。
 *
 * 而是：
 * 天空
 * +
 * 太阳
 * +
 * 大气层
 * +
 * 远景空气感
 *
 * 视觉方向：
 * ------------------------------------------------------------
 * 摄影 / 写实 / 梦幻现实主义
 *
 * 不做：
 * ❌ 卡通天空
 * ❌ 游戏天空盒
 * ❌ 过度 HDR
 * ============================================================
 */

export default class Sky {

    constructor() {

        this.group =
            new THREE.Group();

        this.time = 0;

        this.createSky();
        this.createSun();
        this.createAtmosphere();

    }


    // =========================================================
    // SKY
    // =========================================================

    createSky() {

        const geometry =
            new THREE.SphereGeometry(
                180,
                64,
                32
            );


        const material =
            new THREE.ShaderMaterial({

                side: THREE.BackSide,

                depthWrite: false,

                uniforms: {

                    topColor: {
                        value:
                            new THREE.Color(
                                0x4d9bd6
                            )
                    },

                    middleColor: {
                        value:
                            new THREE.Color(
                                0x9ed6ef
                            )
                    },

                    horizonColor: {
                        value:
                            new THREE.Color(
                                0xf4d8b2
                            )
                    },

                    sunDirection: {
                        value:
                            new THREE.Vector3(
                                -0.45,
                                0.55,
                                -0.7
                            ).normalize()
                    }

                },

                vertexShader: `

                    varying vec3 vWorldPosition;

                    void main(){

                        vec4 worldPosition =
                            modelMatrix *
                            vec4(
                                position,
                                1.0
                            );

                        vWorldPosition =
                            worldPosition.xyz;

                        gl_Position =
                            projectionMatrix *
                            viewMatrix *
                            worldPosition;

                    }

                `,

                fragmentShader: `

                    varying vec3 vWorldPosition;

                    uniform vec3 topColor;
                    uniform vec3 middleColor;
                    uniform vec3 horizonColor;
                    uniform vec3 sunDirection;

                    void main(){

                        vec3 direction =
                            normalize(
                                vWorldPosition -
                                cameraPosition
                            );

                        float height =
                            clamp(
                                direction.y,
                                -0.1,
                                1.0
                            );

                        float horizon =
                            1.0 -
                            smoothstep(
                                0.0,
                                0.45,
                                height
                            );

                        vec3 sky =
                            mix(
                                middleColor,
                                topColor,
                                smoothstep(
                                    0.05,
                                    0.85,
                                    height
                                )
                            );

                        sky =
                            mix(
                                sky,
                                horizonColor,
                                horizon * 0.75
                            );

                        float sun =
                            max(
                                dot(
                                    direction,
                                    normalize(
                                        sunDirection
                                    )
                                ),
                                0.0
                            );

                        sun =
                            pow(
                                sun,
                                32.0
                            );

                        sky +=
                            vec3(
                                1.0,
                                0.55,
                                0.25
                            ) *
                            sun *
                            0.28;

                        gl_FragColor =
                            vec4(
                                sky,
                                1.0
                            );

                    }

                `

            });


        this.sky =
            new THREE.Mesh(
                geometry,
                material
            );


        this.sky.frustumCulled =
            false;


        this.group.add(
            this.sky
        );

    }


    // =========================================================
    // SUN
    // =========================================================

    createSun() {

        const geometry =
            new THREE.SphereGeometry(
                0.55,
                32,
                32
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xffe8b0

            });


        this.sun =
            new THREE.Mesh(
                geometry,
                material
            );


        this.sun.position.set(
            -32,
            24,
            -42
        );


        this.group.add(
            this.sun
        );


        // -----------------------------------------------------
        // SUN GLOW
        // -----------------------------------------------------

        const glowGeometry =
            new THREE.SphereGeometry(
                3.2,
                32,
                32
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffc979,

                transparent:
                    true,

                opacity:
                    0.10,

                depthWrite:
                    false

            });


        this.sunGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.sunGlow.position.copy(
            this.sun.position
        );


        this.group.add(
            this.sunGlow
        );

    }


    // =========================================================
    // ATMOSPHERE
    // =========================================================

    createAtmosphere() {

        const geometry =
            new THREE.SphereGeometry(
                165,
                64,
                32
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xb9dded,

                transparent:
                    true,

                opacity:
                    0.055,

                side:
                    THREE.BackSide,

                depthWrite:
                    false

            });


        this.atmosphere =
            new THREE.Mesh(
                geometry,
                material
            );


        this.group.add(
            this.atmosphere
        );

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(delta) {

        this.time += delta;

        if (this.sunGlow) {

            this.sunGlow.scale.setScalar(

                1 +
                Math.sin(
                    this.time * 0.4
                ) * 0.025

            );

        }

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