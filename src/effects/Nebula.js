import * as THREE from "three";

export default class Nebula {

    constructor() {

        this.group = new THREE.Group();

        this.running = false;

        this.time = 0;

        this.palette = {

            colorA: "#173b68",

            colorB: "#244f82",

            colorC: "#5f5b91",

            colorD: "#13253f"

        };

        this.create();

    }



    // =========================================================
    // CREATE
    // =========================================================

    create() {

        const geometry =
            new THREE.PlaneGeometry(
                120,
                80
            );


        const material =
            new THREE.ShaderMaterial({

                uniforms: {

                    uTime: {
                        value: 0
                    },

                    uColorA: {
                        value:
                            new THREE.Color(
                                this.palette.colorA
                            )
                    },

                    uColorB: {
                        value:
                            new THREE.Color(
                                this.palette.colorB
                            )
                    },

                    uColorC: {
                        value:
                            new THREE.Color(
                                this.palette.colorC
                            )
                    },

                    uColorD: {
                        value:
                            new THREE.Color(
                                this.palette.colorD
                            )
                    },

                    uOpacity: {
                        value: 0.48
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

                    uniform float uTime;

                    uniform vec3 uColorA;
                    uniform vec3 uColorB;
                    uniform vec3 uColorC;
                    uniform vec3 uColorD;

                    uniform float uOpacity;

                    varying vec2 vUv;


                    // =================================================
                    // HASH
                    // =================================================

                    float hash(vec2 p) {

                        return fract(
                            sin(
                                dot(
                                    p,
                                    vec2(
                                        127.1,
                                        311.7
                                    )
                                )
                            ) *
                            43758.5453123
                        );

                    }


                    // =================================================
                    // NOISE
                    // =================================================

                    float noise(vec2 p) {

                        vec2 i =
                            floor(p);

                        vec2 f =
                            fract(p);

                        f =
                            f * f *
                            (
                                3.0 -
                                2.0 * f
                            );


                        float a =
                            hash(i);

                        float b =
                            hash(
                                i +
                                vec2(
                                    1.0,
                                    0.0
                                )
                            );

                        float c =
                            hash(
                                i +
                                vec2(
                                    0.0,
                                    1.0
                                )
                            );

                        float d =
                            hash(
                                i +
                                vec2(
                                    1.0,
                                    1.0
                                )
                            );


                        return mix(
                            mix(
                                a,
                                b,
                                f.x
                            ),
                            mix(
                                c,
                                d,
                                f.x
                            ),
                            f.y
                        );

                    }


                    // =================================================
                    // FBM
                    // =================================================

                    float fbm(vec2 p) {

                        float value =
                            0.0;

                        float amplitude =
                            0.5;


                        for (
                            int i = 0;
                            i < 6;
                            i++
                        ) {

                            value +=
                                noise(p) *
                                amplitude;

                            p *=
                                2.0;

                            amplitude *=
                                0.5;

                        }


                        return value;

                    }


                    // =================================================
                    // DOMAIN WARP
                    //
                    // 这是让星云不像一张静态噪声贴图的关键
                    // =================================================

                    vec2 warp(
                        vec2 p,
                        float time
                    ) {

                        vec2 q;

                        q.x =
                            fbm(
                                p +
                                vec2(
                                    time * 0.018,
                                    0.0
                                )
                            );

                        q.y =
                            fbm(
                                p +
                                vec2(
                                    0.0,
                                    time * 0.014
                                )
                            );


                        vec2 r;

                        r.x =
                            fbm(
                                p +
                                q * 1.8 +
                                vec2(
                                    1.7,
                                    9.2
                                )
                            );

                        r.y =
                            fbm(
                                p +
                                q * 1.8 +
                                vec2(
                                    8.3,
                                    2.8
                                )
                            );


                        return p +
                            r *
                            0.72;

                    }


                    // =================================================
                    // MAIN
                    // =================================================

                    void main() {

                        vec2 uv =
                            vUv;

                        vec2 centered =
                            uv -
                            0.5;


                        // =================================================
                        // 时间
                        //
                        // 非常慢
                        // =================================================

                        float time =
                            uTime;


                        // =================================================
                        // 第一层空间
                        // =================================================

                        vec2 p =
                            centered *
                            2.8;


                        p.x +=
                            sin(
                                p.y * 1.6 +
                                time * 0.025
                            ) *
                            0.16;


                        p.y +=
                            cos(
                                p.x * 1.2 -
                                time * 0.018
                            ) *
                            0.12;


                        // =================================================
                        // DOMAIN WARP
                        // =================================================

                        vec2 warped =
                            warp(
                                p,
                                time
                            );


                        // =================================================
                        // 大尺度云气
                        // =================================================

                        float largeCloud =
                            fbm(
                                warped *
                                1.15
                            );


                        // =================================================
                        // 中尺度云气
                        // =================================================

                        float mediumCloud =
                            fbm(
                                warped *
                                2.35 +
                                vec2(
                                    time * 0.012,
                                    -time * 0.009
                                )
                            );


                        // =================================================
                        // 细节云气
                        // =================================================

                        float fineCloud =
                            fbm(
                                warped *
                                4.5 -
                                vec2(
                                    time * 0.02,
                                    time * 0.014
                                )
                            );


                        // =================================================
                        // 合成
                        // =================================================

                        float cloud =
                            largeCloud *
                            0.56 +

                            mediumCloud *
                            0.30 +

                            fineCloud *
                            0.14;


                        // =================================================
                        // 云气边缘
                        // =================================================

                        cloud =
                            smoothstep(
                                0.30,
                                0.76,
                                cloud
                            );


                        // =================================================
                        // 缓慢波浪
                        // =================================================

                        float wave1 =
                            sin(
                                warped.x * 3.2 +
                                warped.y * 1.7 +
                                time * 0.035
                            );


                        float wave2 =
                            sin(
                                warped.y * 4.0 -
                                warped.x * 1.4 -
                                time * 0.026
                            );


                        float waves =
                            (
                                wave1 +
                                wave2
                            ) *
                            0.5;


                        waves =
                            waves *
                            0.5 +
                            0.5;


                        cloud +=
                            waves *
                            0.055;


                        // =================================================
                        // 中央聚集
                        // =================================================

                        float radius =
                            length(
                                centered
                            );


                        float centerGlow =
                            1.0 -
                            smoothstep(
                                0.04,
                                0.82,
                                radius
                            );


                        cloud *=
                            0.70 +
                            centerGlow *
                            0.34;


                        // =================================================
                        // 局部呼吸
                        //
                        // 非常慢
                        // =================================================

                        float breathing =
                            sin(
                                time * 0.12 +
                                largeCloud * 5.0
                            );


                        breathing =
                            breathing *
                            0.5 +
                            0.5;


                        cloud *=
                            0.94 +
                            breathing *
                            0.10;


                        // =================================================
                        // 边缘淡出
                        // =================================================

                        float edge =
                            1.0 -
                            smoothstep(
                                0.35,
                                0.78,
                                radius
                            );


                        // =================================================
                        // 颜色
                        // =================================================

                        float c =
                            clamp(
                                cloud,
                                0.0,
                                1.0
                            );


                        vec3 color;


                        if (
                            c < 0.30
                        ) {

                            color =
                                mix(
                                    uColorD,
                                    uColorA,
                                    c / 0.30
                                );

                        }

                        else if (
                            c < 0.62
                        ) {

                            color =
                                mix(
                                    uColorA,
                                    uColorB,
                                    (
                                        c -
                                        0.30
                                    ) /
                                    0.32
                                );

                        }

                        else {

                            color =
                                mix(
                                    uColorB,
                                    uColorC,
                                    (
                                        c -
                                        0.62
                                    ) /
                                    0.38
                                );

                        }


                        // =================================================
                        // 云气高光
                        // =================================================

                        color +=
                            uColorC *
                            pow(
                                cloud,
                                3.2
                            ) *
                            0.18;


                        // =================================================
                        // Alpha
                        // =================================================

                        float alpha =
                            cloud *
                            edge *
                            uOpacity;


                        alpha +=
                            centerGlow *
                            0.018;


                        // =================================================
                        // 最终
                        // =================================================

                        gl_FragColor =
                            vec4(
                                color,
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
                    THREE.AdditiveBlending,

                side:
                    THREE.DoubleSide,

                toneMapped:
                    false

            });


        this.mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        this.mesh.position.set(
            0,
            0,
            -20
        );


        this.mesh.renderOrder =
            -80;


        this.group.add(
            this.mesh
        );

    }



    // =========================================================
    // START
    // =========================================================

    start() {

        this.running =
            true;

    }



    // =========================================================
    // STOP
    // =========================================================

    stop() {

        this.running =
            false;

    }



    // =========================================================
    // UPDATE
    // =========================================================

    update(
        delta = 0.016
    ) {

        if (
            !this.mesh ||
            !this.mesh.material ||
            !this.mesh.material.uniforms
        ) {

            return;

        }


        if (
            !this.running
        ) {

            return;

        }


        this.time +=
            delta;


        this.mesh
            .material
            .uniforms
            .uTime
            .value =
            this.time;

    }



    // =========================================================
    // SET COLORS
    // =========================================================

    setColors(
        colors = {}
    ) {

        Object.assign(
            this.palette,
            colors
        );


        if (
            !this.mesh ||
            !this.mesh.material ||
            !this.mesh.material.uniforms
        ) {

            return;

        }


        const uniforms =
            this.mesh
                .material
                .uniforms;


        if (
            colors.colorA !== undefined
        ) {

            uniforms.uColorA
                .value
                .set(
                    colors.colorA
                );

        }


        if (
            colors.colorB !== undefined
        ) {

            uniforms.uColorB
                .value
                .set(
                    colors.colorB
                );

        }


        if (
            colors.colorC !== undefined
        ) {

            uniforms.uColorC
                .value
                .set(
                    colors.colorC
                );

        }


        if (
            colors.colorD !== undefined
        ) {

            uniforms.uColorD
                .value
                .set(
                    colors.colorD
                );

        }

    }



    // =========================================================
    // SET OPACITY
    // =========================================================

    setOpacity(
        value
    ) {

        if (
            !this.mesh ||
            !this.mesh.material ||
            !this.mesh.material.uniforms
        ) {

            return;

        }


        this.mesh
            .material
            .uniforms
            .uOpacity
            .value =
            Number(
                value
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