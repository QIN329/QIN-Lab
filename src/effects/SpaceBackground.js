import * as THREE from "three";


export default class SpaceBackground {

    constructor() {

        this.group =
            new THREE.Group();


        // =====================================================
        // QIN LAB — SPACE CONTROL
        // =====================================================

        this.width =
            100;

        this.height =
            100;


        // =====================================================
        // 当前颜色系统
        //
        // 以后可以直接修改这里
        // =====================================================

        this.palette = {

            // ---------------------------------------------
            // 背景顶部
            // ---------------------------------------------

            top:
                0x02030a,


            // ---------------------------------------------
            // 背景中部
            // ---------------------------------------------

            middle:
                0x102f52,


            // ---------------------------------------------
            // 背景底部
            // ---------------------------------------------

            bottom:
                0x07152d,


            // ---------------------------------------------
            // 宇宙雾气
            // ---------------------------------------------

            atmosphere:
                0x173b68,


            // ---------------------------------------------
            // 雾气透明度
            //
            // 0   = 没有雾
            // 0.1 = 很轻
            // 0.18 = 当前感觉
            // 0.3 = 明显
            // ---------------------------------------------

            atmosphereOpacity:
                0.18,


            // ---------------------------------------------
            // 宇宙呼吸幅度
            // ---------------------------------------------

            breathing:
                0.006,


            // ---------------------------------------------
            // 雾气呼吸幅度
            // ---------------------------------------------

            atmosphereBreathing:
                0.05

        };


        // =====================================================
        // 平滑颜色过渡
        // =====================================================

        this.currentColor =
            new THREE.Color(
                this.palette.middle
            );

        this.targetColor =
            this.currentColor.clone();


        this.transitionSpeed =
            0.35;


        // =====================================================
        // 创建
        // =====================================================

        this.create();

    }


    // =========================================================
    // CREATE
    // =========================================================

    create() {

        this.createGradientBackground();

        this.createAtmosphere();

    }


    // =========================================================
    // GRADIENT BACKGROUND
    // =========================================================

    createGradientBackground() {

        const geometry =
            new THREE.PlaneGeometry(
                this.width,
                this.height
            );


        const material =
            new THREE.ShaderMaterial({

                uniforms: {

                    uTopColor: {

                        value:
                            new THREE.Color(
                                this.palette.top
                            )

                    },


                    uBottomColor: {

                        value:
                            new THREE.Color(
                                this.palette.bottom
                            )

                    },


                    uMiddleColor: {

                        value:
                            new THREE.Color(
                                this.palette.middle
                            )

                    },


                    uTime: {

                        value:
                            0

                    },


                    uOpacity: {

                        value:
                            1

                    },


                    uBreathing: {

                        value:
                            this.palette.breathing

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

                    uniform vec3 uTopColor;

                    uniform vec3 uBottomColor;

                    uniform vec3 uMiddleColor;

                    uniform float uTime;

                    uniform float uOpacity;

                    uniform float uBreathing;


                    varying vec2 vUv;


                    void main() {

                        float y =
                            vUv.y;


                        vec3 color;


                        // =====================================
                        // 下半部分
                        // =====================================

                        if (
                            y < 0.55
                        ) {

                            float t =
                                smoothstep(
                                    0.0,
                                    0.55,
                                    y
                                );


                            color =
                                mix(
                                    uBottomColor,
                                    uMiddleColor,
                                    t
                                );

                        }


                        // =====================================
                        // 上半部分
                        // =====================================

                        else {

                            float t =
                                smoothstep(
                                    0.55,
                                    1.0,
                                    y
                                );


                            color =
                                mix(
                                    uMiddleColor,
                                    uTopColor,
                                    t
                                );

                        }


                        // =====================================
                        // 极轻微宇宙呼吸
                        // =====================================

                        float movement =
                            sin(
                                uTime * 0.08 +
                                vUv.x * 2.0
                            ) *
                            uBreathing;


                        color +=
                            movement;


                        gl_FragColor =
                            vec4(
                                color,
                                uOpacity
                            );

                    }

                `,


                side:
                    THREE.DoubleSide,


                depthWrite:
                    false,


                depthTest:
                    false

            });


        this.backgroundMesh =
            new THREE.Mesh(
                geometry,
                material
            );


        this.backgroundMesh.position.set(
            0,
            0,
            -25
        );


        this.backgroundMesh.renderOrder =
            -100;


        this.group.add(
            this.backgroundMesh
        );

    }


    // =========================================================
    // ATMOSPHERE
    // =========================================================

    createAtmosphere() {

        const geometry =
            new THREE.PlaneGeometry(
                70,
                70
            );


        const material =
            new THREE.ShaderMaterial({

                uniforms: {

                    uColor: {

                        value:
                            new THREE.Color(
                                this.palette.atmosphere
                            )

                    },


                    uOpacity: {

                        value:
                            this.palette
                                .atmosphereOpacity

                    },


                    uTime: {

                        value:
                            0

                    },


                    uBreathing: {

                        value:
                            this.palette
                                .atmosphereBreathing

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

                    uniform float uTime;

                    uniform float uBreathing;


                    varying vec2 vUv;


                    void main() {

                        vec2 uv =
                            vUv - 0.5;


                        float distanceFromCenter =
                            length(uv);


                        // =====================================
                        // 中央雾气
                        // =====================================

                        float glow =
                            1.0 -
                            smoothstep(
                                0.05,
                                0.72,
                                distanceFromCenter
                            );


                        // =====================================
                        // 非常缓慢的呼吸
                        // =====================================

                        float breathing =
                            1.0 +
                            sin(
                                uTime * 0.15
                            ) *
                            uBreathing;


                        float alpha =
                            glow *
                            uOpacity *
                            breathing;


                        gl_FragColor =
                            vec4(
                                uColor,
                                alpha
                            );

                    }

                `,


                transparent:
                    true,


                depthWrite:
                    false,


                depthTest:
                    false,


                blending:
                    THREE.AdditiveBlending

            });


        this.atmosphere =
            new THREE.Mesh(
                geometry,
                material
            );


        this.atmosphere.position.set(
            0,
            1,
            -18
        );


        this.atmosphere.renderOrder =
            -90;


        this.group.add(
            this.atmosphere
        );

    }


    // =========================================================
    // SET PALETTE
    //
    // 整套宇宙颜色控制
    // =========================================================

    setPalette(palette = {}) {

        Object.assign(
            this.palette,
            palette
        );


        // =====================================================
        // 背景 Shader
        // =====================================================

        if (
            this.backgroundMesh &&
            this.backgroundMesh.material &&
            this.backgroundMesh.material.uniforms
        ) {

            const uniforms =
                this.backgroundMesh
                    .material
                    .uniforms;


            if (uniforms.uTopColor) {

                uniforms.uTopColor.value.set(
                    this.palette.top
                );

            }


            if (uniforms.uMiddleColor) {

                uniforms.uMiddleColor.value.set(
                    this.palette.middle
                );

            }


            if (uniforms.uBottomColor) {

                uniforms.uBottomColor.value.set(
                    this.palette.bottom
                );

            }


            if (uniforms.uBreathing) {

                uniforms.uBreathing.value =
                    this.palette.breathing;

            }

        }


        // =====================================================
        // Atmosphere Shader
        // =====================================================

        if (
            this.atmosphere &&
            this.atmosphere.material &&
            this.atmosphere.material.uniforms
        ) {

            const uniforms =
                this.atmosphere
                    .material
                    .uniforms;


            if (uniforms.uColor) {

                uniforms.uColor.value.set(
                    this.palette.atmosphere
                );

            }


            if (uniforms.uOpacity) {

                uniforms.uOpacity.value =
                    this.palette
                        .atmosphereOpacity;

            }


            if (uniforms.uBreathing) {

                uniforms.uBreathing.value =
                    this.palette
                        .atmosphereBreathing;

            }

        }


        // =====================================================
        // 当前颜色
        // =====================================================

        this.targetColor.set(
            this.palette.middle
        );

    }


    // =========================================================
    // SET COLOR
    //
    // 兼容旧代码
    // =========================================================

    setColor(color) {

        if (
            color instanceof THREE.Color
        ) {

            this.targetColor.copy(
                color
            );

            this.palette.middle =
                color.getHex();

        }

        else {

            this.targetColor.set(
                color
            );

            this.palette.middle =
                new THREE.Color(
                    color
                ).getHex();

        }


        // 同时修改中间色
        if (
            this.backgroundMesh &&
            this.backgroundMesh.material &&
            this.backgroundMesh.material.uniforms &&
            this.backgroundMesh.material.uniforms
                .uMiddleColor
        ) {

            this.backgroundMesh
                .material
                .uniforms
                .uMiddleColor
                .value
                .set(color);

        }

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(
        delta = 0.016
    ) {

        if (!this.backgroundMesh) {

            return;

        }


        // =====================================================
        // Background Time
        // =====================================================

        const backgroundUniforms =
            this.backgroundMesh
                .material
                .uniforms;


        if (
            backgroundUniforms.uTime
        ) {

            backgroundUniforms
                .uTime
                .value += delta;

        }


        // =====================================================
        // Atmosphere Time
        // =====================================================

        if (
            this.atmosphere &&
            this.atmosphere.material &&
            this.atmosphere.material.uniforms
        ) {

            const atmosphereUniforms =
                this.atmosphere
                    .material
                    .uniforms;


            if (
                atmosphereUniforms.uTime
            ) {

                atmosphereUniforms
                    .uTime
                    .value += delta;

            }

        }


        // =====================================================
        // Smooth Color
        // =====================================================

        this.currentColor.lerp(
            this.targetColor,
            Math.min(
                1,
                delta *
                this.transitionSpeed
            )
        );

    }


    // =========================================================
    // GET PALETTE
    // =========================================================

    getPalette() {

        return {
            ...this.palette
        };

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


        this.group.clear();

    }

}