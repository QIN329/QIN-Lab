import * as THREE from "three";


export default class DynamicNightBackground {


    constructor(){


        this.group = new THREE.Group();


        this.time = 0;


        this.create();


    }





    create(){


        // =====================================================
        // 全屏动态夜空
        // =====================================================

        const geometry =

            new THREE.PlaneGeometry(

                100,

                100

            );



        const material =

            new THREE.ShaderMaterial({

                uniforms: {

                    uTime: {

                        value: 0

                    }

                },


                vertexShader: `

                    varying vec2 vUv;


                    void main(){

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


                    varying vec2 vUv;


                    void main(){


                        vec2 uv = vUv;


                        // =================================================
                        // 时间
                        // =================================================

                        float t = uTime;


                        // =================================================
                        // 基础深蓝
                        // =================================================

                        vec3 colorA =

                            vec3(

                                0.008,

                                0.018,

                                0.055

                            );


                        vec3 colorB =

                            vec3(

                                0.015,

                                0.030,

                                0.085

                            );


                        vec3 colorC =

                            vec3(

                                0.025,

                                0.040,

                                0.115

                            );


                        vec3 colorD =

                            vec3(

                                0.045,

                                0.035,

                                0.125

                            );



                        // =================================================
                        // 整体呼吸
                        // =================================================

                        float breathing =

                            sin(

                                t * 0.18

                            );


                        breathing =

                            breathing * 0.5 + 0.5;



                        // =================================================
                        // 第一层：整个画面的基础流动
                        // =================================================

                        float wave1 =

                            sin(

                                uv.x * 3.0 +

                                t * 0.10

                            );


                        float wave2 =

                            cos(

                                uv.y * 2.5 -

                                t * 0.08

                            );


                        float wave3 =

                            sin(

                                (

                                    uv.x +

                                    uv.y

                                ) * 2.2 +

                                t * 0.07

                            );



                        float movement =

                            (

                                wave1 +

                                wave2 +

                                wave3

                            ) / 3.0;



                        movement =

                            movement * 0.5 + 0.5;



                        // =================================================
                        // 第二层：极慢的大范围颜色漂移
                        // =================================================

                        float drift =

                            sin(

                                t * 0.045 +

                                uv.x * 1.5 +

                                uv.y * 1.2

                            );


                        drift =

                            drift * 0.5 + 0.5;



                        // =================================================
                        // 第三层：中心区域的柔和变化
                        // =================================================

                        vec2 center =

                            vec2(

                                0.5,

                                0.5

                            );


                        float centerDistance =

                            distance(

                                uv,

                                center

                            );



                        float centerGlow =

                            1.0 -

                            smoothstep(

                                0.0,

                                0.8,

                                centerDistance

                            );



                        centerGlow =

                            pow(

                                centerGlow,

                                1.5

                            );



                        // =================================================
                        // 颜色开始融合
                        // =================================================

                        vec3 color =

                            mix(

                                colorA,

                                colorB,

                                movement * 0.55

                            );



                        color =

                            mix(

                                color,

                                colorC,

                                drift * 0.32

                            );



                        color =

                            mix(

                                color,

                                colorD,

                                breathing *

                                centerGlow *

                                0.18

                            );



                        // =================================================
                        // 整体亮度呼吸
                        // =================================================

                        float globalBreath =

                            0.90 +

                            breathing *

                            0.12;



                        color *=

                            globalBreath;



                        // =================================================
                        // 非常轻微的蓝色漂移
                        // =================================================

                        color +=

                            vec3(

                                0.002,

                                0.004,

                                0.012

                            ) *

                            movement;



                        // =================================================
                        // 保持整体深色
                        // =================================================

                        color =

                            clamp(

                                color,

                                0.0,

                                1.0

                            );



                        gl_FragColor =

                            vec4(

                                color,

                                1.0

                            );

                    }

                `,


                depthWrite: false,


                depthTest: false


            });



        this.background =

            new THREE.Mesh(

                geometry,

                material

            );



        this.background.position.set(

            0,

            0,

            -30

        );



        this.background.frustumCulled =

            false;



        this.group.add(

            this.background

        );



        this.material =

            material;

    }





    update(delta){


        this.time += delta;


        if(this.material){


            this.material.uniforms.uTime.value =

                this.time;


        }

    }





    getObject(){


        return this.group;


    }





    dispose(){


        this.group.clear();


    }


}