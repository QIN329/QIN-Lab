
import * as THREE from "three";
import { gsap } from "gsap";


export default class QinLogo {


    constructor(){


        this.group =
            new THREE.Group();


        this.text = null;


        // =====================================================
        // QIN LAB 参数
        // =====================================================

        this.positionX = 0;

        this.positionY = -2;

        this.positionZ = -2;


        // =====================================================
        // QIN LAB 大小
        // =====================================================

        this.logoWidth = 10;

        this.logoHeight = 2.5;


        // =====================================================
        // 字体
        // =====================================================

        this.fontSize = 120;


        // =====================================================
        // QIN LAB 两种颜色
        //
        // 左侧颜色
        //
        // 保留原来的青蓝色方向
        // 但提高一点亮度
        // =====================================================

        this.colorStart =
            "#35dfff";


        // =====================================================
        // 右侧颜色
        //
        // 保留原来的浅黄色方向
        // =====================================================

        this.colorEnd =
            "#ffffb0";


        // =====================================================
        // 渐变方向
        //
        // "horizontal"
        // 左 → 右
        //
        // "vertical"
        // 下 → 上
        //
        // 目前使用 horizontal
        // =====================================================

        this.gradientDirection =
            "horizontal";


        // =====================================================
        // 粒子数量
        // =====================================================

        this.particleCount =
            850;


        // =====================================================
        // 粒子大小
        //
        // 原来：
        // 0.018
        //
        // 现在：
        // 0.024
        //
        // 让 QIN LAB 的字形更加清晰
        // =====================================================

        this.particleSize =
            0.024;


        // =====================================================
        // 粒子随机扩散
        // =====================================================

        this.particleSpread =
            0.035;


        // =====================================================
        // 粒子基础亮度
        //
        // 原来 0.9
        // 提高到 1.0
        // =====================================================

        this.particleOpacity =
            1.0;


        // =====================================================
        // 每颗星星亮度随机
        //
        // 原来最低 0.55
        //
        // 现在最低 0.90
        //
        // 避免 QIN LAB 出现大量暗淡粒子
        // =====================================================

        this.particleMinOpacity =
            0.90;


        this.particleMaxOpacity =
            1.0;


        // =====================================================
        // 星星闪烁
        // =====================================================

        this.enableTwinkle =
            true;


        // =====================================================
        // 闪烁幅度
        //
        // 原来 0.18
        //
        // 降到 0.06
        //
        // 让 QIN LAB 保持稳定明亮
        // =====================================================

        this.twinkleAmount =
            0.06;


        this.twinkleSpeed =
            2.2;


        // =====================================================
        // QIN LAB 出现时间
        // =====================================================

        this.showDuration =
            1.5;


        // =====================================================
        // QIN LAB 消失时间
        // =====================================================

        this.hideDuration =
            1;


        // =====================================================
        // 初始状态
        // =====================================================

        this.initialOpacity =
            0;


        // =====================================================
        // 时间
        // =====================================================

        this.time =
            0;


        // =====================================================
        // 创建
        // =====================================================

        this.create();

    }


    // =========================================================
    // CREATE
    // =========================================================

    create(){


        // =====================================================
        // Canvas
        // =====================================================

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            1024;


        canvas.height =
            256;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );


        // =====================================================
        // 绘制 QIN LAB
        // =====================================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            `bold ${this.fontSize}px Arial`;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "QIN LAB",

            512,

            128

        );


        // =====================================================
        // 读取 Canvas 像素
        // =====================================================

        const imageData =
            ctx.getImageData(

                0,

                0,

                canvas.width,

                canvas.height

            );


        const data =
            imageData.data;


        // =====================================================
        // 收集文字像素
        // =====================================================

        const pixels = [];


        const sampleStep =
            4;


        for(

            let y = 0;

            y < canvas.height;

            y += sampleStep

        ){


            for(

                let x = 0;

                x < canvas.width;

                x += sampleStep

            ){


                const index =

                    (

                        y *

                        canvas.width +

                        x

                    ) *

                    4;


                const alpha =
                    data[index + 3];


                if(alpha > 80){

                    pixels.push({

                        x: x,

                        y: y,

                        alpha:
                            alpha / 255

                    });

                }

            }

        }


        // =====================================================
        // 随机抽样
        // =====================================================

        let selectedPixels =
            pixels;


        if(

            pixels.length >

            this.particleCount

        ){


            const shuffled =
                [...pixels];


            for(

                let i =
                    shuffled.length - 1;

                i > 0;

                i--

            ){


                const j =

                    Math.floor(

                        Math.random() *

                        (i + 1)

                    );


                [

                    shuffled[i],

                    shuffled[j]

                ] = [

                    shuffled[j],

                    shuffled[i]

                ];

            }


            selectedPixels =

                shuffled.slice(

                    0,

                    this.particleCount

                );

        }


        // =====================================================
        // 粒子位置
        // =====================================================

        const positions = [];


        // =====================================================
        // 粒子颜色
        // =====================================================

        const colors = [];


        // =====================================================
        // 每颗星星亮度
        // =====================================================

        const particleAlphas = [];


        // =====================================================
        // 起始颜色
        // =====================================================

        const startColor =
            new THREE.Color(
                this.colorStart
            );


        // =====================================================
        // 结束颜色
        // =====================================================

        const endColor =
            new THREE.Color(
                this.colorEnd
            );


        // =====================================================
        // Canvas → Three.js
        // =====================================================

        for(

            let i = 0;

            i < selectedPixels.length;

            i++

        ){


            const pixel =
                selectedPixels[i];


            // =================================================
            // X
            // =================================================

            const normalizedX =

                (

                    pixel.x -

                    canvas.width / 2

                )

                /

                canvas.width;


            // =================================================
            // Y
            // =================================================

            const normalizedY =

                (

                    canvas.height / 2 -

                    pixel.y

                )

                /

                canvas.height;


            // =================================================
            // Three.js 坐标
            // =================================================

            const x =

                normalizedX *

                this.logoWidth;


            const y =

                normalizedY *

                this.logoHeight;


            // =================================================
            // 星尘扩散
            // =================================================

            const spreadX =

                (

                    Math.random() -

                    0.5

                )

                *

                this.particleSpread;


            const spreadY =

                (

                    Math.random() -

                    0.5

                )

                *

                this.particleSpread;


            const finalX =
                x + spreadX;


            const finalY =
                y + spreadY;


            positions.push(

                finalX,

                finalY,

                0

            );


            // =================================================
            // 计算渐变位置
            // =================================================

            let gradientProgress;


            if(

                this.gradientDirection ===
                "vertical"

            ){

                gradientProgress =

                    (

                        normalizedY + 0.5

                    );

            } else {

                gradientProgress =

                    (

                        normalizedX + 0.5

                    );

            }


            // =================================================
            // 限制范围
            // =================================================

            gradientProgress =
                THREE.MathUtils.clamp(

                    gradientProgress,

                    0,

                    1

                );


            // =================================================
            // 当前粒子的颜色
            // =================================================

            const particleColor =
                startColor.clone().lerp(

                    endColor,

                    gradientProgress

                );


            colors.push(

                particleColor.r,

                particleColor.g,

                particleColor.b

            );


            // =================================================
            // 每颗星星独立亮度
            //
            // 现在最低 90%
            // =================================================

            const randomOpacity =

                this.particleMinOpacity +

                Math.random() *

                (

                    this.particleMaxOpacity -

                    this.particleMinOpacity

                );


            particleAlphas.push(

                randomOpacity *

                pixel.alpha

            );

        }


        // =====================================================
        // Geometry
        // =====================================================

        const geometry =
            new THREE.BufferGeometry();


        // =====================================================
        // 位置
        // =====================================================

        geometry.setAttribute(

            "position",

            new THREE.Float32BufferAttribute(

                positions,

                3

            )

        );


        // =====================================================
        // 颜色
        // =====================================================

        geometry.setAttribute(

            "color",

            new THREE.Float32BufferAttribute(

                colors,

                3

            )

        );


        geometry.computeBoundingSphere();


        // =====================================================
        // Material
        //
        // vertexColors = true
        //
        // toneMapped = false
        //
        // 防止 ACES Filmic Tone Mapping
        // 把 QIN LAB 的颜色压暗
        // =====================================================

        const material =

            new THREE.PointsMaterial({

                vertexColors:
                    true,

                size:
                    this.particleSize,

                transparent:
                    true,

                opacity:
                    this.initialOpacity,

                depthWrite:
                    false,

                depthTest:
                    false,

                blending:
                    THREE.AdditiveBlending,

                sizeAttenuation:
                    true,

                // =================================================
                // ★ 核心提亮
                // =================================================

                toneMapped:
                    false

            });


        // =====================================================
        // Points
        // =====================================================

        this.text =

            new THREE.Points(

                geometry,

                material

            );


        // =====================================================
        // 保存数据
        // =====================================================

        this.text.userData.text =
            "QIN LAB";


        this.text.userData.particleAlphas =
            particleAlphas;


        this.text.userData.twinklePhase =

            Math.random() *

            Math.PI *

            2;


        // =====================================================
        // 保存渐变颜色
        // =====================================================

        this.text.userData.colorStart =
            this.colorStart;


        this.text.userData.colorEnd =
            this.colorEnd;


        // =====================================================
        // 位置
        // =====================================================

        this.text.position.set(

            this.positionX,

            this.positionY,

            this.positionZ

        );


        // =====================================================
        // 初始缩放
        // =====================================================

        this.text.scale.set(

            0.85,

            0.85,

            0.85

        );


        // =====================================================
        // 加入 Group
        // =====================================================

        this.group.add(

            this.text

        );

    }


    // =========================================================
    // SHOW
    // =========================================================

    show(){


        if(!this.text){

            return;

        }


        // =====================================================
        // 停止之前动画
        // =====================================================

        gsap.killTweensOf(

            this.text.material

        );


        gsap.killTweensOf(

            this.text.scale

        );


        // =====================================================
        // 从隐藏状态开始
        // =====================================================

        this.text.material.opacity =

            0;


        this.text.scale.set(

            0.85,

            0.85,

            0.85

        );


        // =====================================================
        // 粒子文字淡入
        // =====================================================

        gsap.to(

            this.text.material,

            {

                opacity:

                    this.particleOpacity,

                duration:

                    this.showDuration,

                ease:
                    "power2.out"

            }

        );


        // =====================================================
        // 粒子文字轻微放大
        // =====================================================

        gsap.to(

            this.text.scale,

            {

                x: 1,

                y: 1,

                z: 1,

                duration:

                    this.showDuration,

                ease:
                    "power2.out"

            }

        );

    }


    // =========================================================
    // HIDE
    // =========================================================

    hide(){


        if(!this.text){

            return;

        }


        gsap.to(

            this.text.material,

            {

                opacity:
                    0,

                duration:
                    this.hideDuration,

                ease:
                    "power2.inOut"

            }

        );

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(delta = 0.016){


        if(!this.text){

            return;

        }


        this.time +=
            delta;


        // =====================================================
        // 星星闪烁
        // =====================================================

        if(

            this.enableTwinkle &&

            this.text.material.opacity > 0

        ){


            const phase =

                this.text.userData.twinklePhase ||

                0;


            const twinkle =

                Math.sin(

                    this.time *

                    this.twinkleSpeed +

                    phase

                )

                *

                this.twinkleAmount;


            // =================================================
            // 注意：
            //
            // 保持整体亮度稳定
            // =================================================

            const baseOpacity =

                this.particleOpacity;


            this.text.material.opacity =

                Math.max(

                    0,

                    Math.min(

                        1,

                        baseOpacity +

                        twinkle *

                        0.05

                    )

                );

        }

    }


    // =========================================================
    // GET OBJECT
    // =========================================================

    getObject(){


        return this.group;

    }


    // =========================================================
    // DISPOSE
    // =========================================================

    dispose(){


        // =====================================================
        // 清理动画
        // =====================================================

        if(this.text){

            gsap.killTweensOf(

                this.text.material

            );


            gsap.killTweensOf(

                this.text.scale

            );

        }


        // =====================================================
        // 清理 Geometry
        // =====================================================

        if(

            this.text &&

            this.text.geometry

        ){

            this.text.geometry.dispose();

        }


        // =====================================================
        // 清理 Material
        // =====================================================

        if(

            this.text &&

            this.text.material

        ){

            this.text.material.dispose();

        }


        // =====================================================
        // 清理
        // =====================================================

        this.group.clear();


        this.text = null;

    }

}