import * as THREE from "three";
import { gsap } from "gsap";

export default class LoveSequence {

    constructor(){

        this.group = new THREE.Group();

        this.started = false;

        // =====================================================
        // I LOVE / I KNOW
        // =====================================================

        this.firstLove = null;
        this.knowWord = null;

        // =====================================================
        // I KNOW
        // =====================================================

        this.wordCount = 1;

        // =====================================================
        // 字体大小
        // =====================================================

        this.loveSize = 1;
        this.knowSize = 1;

        // =====================================================
        // I KNOW 位置
        // =====================================================

        this.knowPositionX = 0;
        this.knowPositionY = -3;

        // =====================================================
        // 文字粒子数量
        // =====================================================

        this.textParticleCount = 550;

        // =====================================================
        // 解体后的星星数量
        // =====================================================

        this.disintegrationStarCount = 3290;

        // =====================================================
        // 是否允许额外解体星星
        // =====================================================

        this.allowExtraDisintegrationStars = true;

        // =====================================================
        // 解体星星随机扩散
        // =====================================================

        this.disintegrationSpread = 0.025;

        // =====================================================
        // 解体星星大小
        // =====================================================

        this.disintegrationStarSizeMin = 0.65;

        this.disintegrationStarSizeMax = 1.75;

        // =====================================================
        // 文字星星大小
        //
        // 原来 0.018
        // 提高到 0.024
        //
        // 让 I LOVE / I KNOW 更清楚、更有存在感
        // =====================================================

        this.textParticleSize = 0.024;

        // =====================================================
        // 文字星尘轻微随机
        // =====================================================

        this.textParticleSpread = 0.035;

        // =====================================================
        // 文字亮度
        //
        // 原来 0.9
        // 提高到 1.0
        // =====================================================

        this.textParticleOpacity = 1.0;

        // =====================================================
        // 粒子闪烁
        // =====================================================

        this.enableParticleTwinkle = true;

        // =====================================================
        // 闪烁幅度
        //
        // 原来 0.15
        // 降低到 0.06
        //
        // 让文字保持稳定明亮，
        // 不再出现明显忽暗忽亮
        // =====================================================

        this.twinkleAmount = 0.06;

        this.twinkleSpeed = 2.5;

        // =====================================================
        // 星轨中心
        // =====================================================

        this.trailCenterX = 0;

        this.trailCenterY = 0;

        // =====================================================
        // 星轨数量
        // =====================================================

        this.trailCount = 42;

        // =====================================================
        // 每条轨道理论星点数量
        // =====================================================

        this.starsPerTrail = 88;

        // =====================================================
        // 星轨半径
        // =====================================================

        this.minRadius = 1.0;

        this.maxRadius = 18;

        this.trailYScale = 0.3;

        this.trailLength = 5.5;

        this.trailCurve = 1.8;

        // =====================================================
        // 星轨旋转
        // =====================================================

        this.rotationSpeed = 0.0018;

        this.speedVariation = 0.35;

        // =====================================================
        // 星轨星点大小
        // =====================================================

        this.starSize = 0.01;

        // =====================================================
        // 星轨亮度
        // =====================================================

        this.starOpacity = 0.72;

        // =====================================================
        // I KNOW 解体
        // =====================================================

        this.disperseDelay = 1.5;

        // =====================================================
        // 解体持续时间
        // =====================================================

        this.disintegrationDuration = 1.5;

        // =====================================================
        // 解体错峰
        // =====================================================

        this.disintegrationStagger = 0.65;

        // =====================================================
        // ★ 特殊流星
        //
        // 在 I KNOW 解体瞬间出现
        // 高速划过屏幕
        // 最后撞入中央
        //
        // 它不会停在中央
        // 而是撞入以后立即消失
        // =====================================================

        // -----------------------------------------------------
        // 流星起点
        // ★ 可以自己调整
        // -----------------------------------------------------

        this.streakStartX = -10;

        this.streakStartY = 2.5;

        // -----------------------------------------------------
        // 流星终点
        // ★ 可以自己调整
        //
        // 默认中央
        // -----------------------------------------------------

        this.streakEndX = 0;

        this.streakEndY = 0;

        // -----------------------------------------------------
        // Z 深度
        // -----------------------------------------------------

        this.streakZ = -1.5;

        // -----------------------------------------------------
        // 流线长度
        // -----------------------------------------------------

        this.streakLength = 3.8;

        // -----------------------------------------------------
        // 流线粗细
        // -----------------------------------------------------

        this.streakWidth = 0.025;

        // -----------------------------------------------------
        // 流线颜色
        // -----------------------------------------------------

        this.streakColor = "#ffffff";

        // -----------------------------------------------------
        // 流线亮度
        // -----------------------------------------------------

        this.streakOpacity = 0.9;

        // -----------------------------------------------------
        // ★ 流星飞行时间
        //
        // 越小越快
        // -----------------------------------------------------

        this.streakDuration = 0.5;

        // -----------------------------------------------------
        // ★ 与字体解体同步
        //
        // 0 = 完全同时
        // -----------------------------------------------------

        this.streakDelay = 0;

        // -----------------------------------------------------
        // ★ 撞击后消失
        //
        // 很短
        // 不让流星停在中央
        // -----------------------------------------------------

        this.streakFadeDuration = 0.12;

        // -----------------------------------------------------
        // 流线
        // -----------------------------------------------------

        this.streak = null;

        this.streakTexture = null;

        // =====================================================
        // 星轨
        // =====================================================

        this.trails = [];

        this.trailsStarted = false;

        // =====================================================
        // 时间
        // =====================================================

        this.time = 0;

        // =====================================================
        // 创建
        // =====================================================

        this.create();
    }


    // =========================================================
    // CREATE
    // =========================================================

    create(){

        this.firstLove =
            this.createText(
                "I LOVE",
                "#ffffff",
                this.loveSize
            );

        // =====================================================
        // 创建特殊流线
        // =====================================================

        this.createStreak();
    }


    // =========================================================
    // CREATE TEXT
    // =========================================================

    createText(
        text,
        color,
        size
    ){

        const canvas =
            document.createElement("canvas");

        canvas.width = 1024;
        canvas.height = 256;

        const ctx =
            canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // =====================================================
        // 绘制文字
        // =====================================================

        ctx.fillStyle = color;

        ctx.font =
            "bold 150px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            text,
            512,
            128
        );

        // =====================================================
        // 读取像素
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

        const sampleStep = 4;

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
                    ) * 4;

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
            this.textParticleCount
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
                    this.textParticleCount
                );

        }

        // =====================================================
        // 粒子数据
        // =====================================================

        const positions = [];

        const particleAlphas = [];

        const originalPositions = [];

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
            // Three.js 尺寸
            // =================================================

            const x =
                normalizedX *
                4.5 *
                size;

            const y =
                normalizedY *
                1.15 *
                size;

            // =================================================
            // 星尘扰动
            // =================================================

            const spreadX =
                (
                    Math.random() -
                    0.5
                )
                *
                this.textParticleSpread;

            const spreadY =
                (
                    Math.random() -
                    0.5
                )
                *
                this.textParticleSpread;

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
            // 保存原始位置
            // =================================================

            originalPositions.push({

                x: finalX,

                y: finalY,

                z: 0

            });

            // =================================================
            // 每颗星自己的亮度
            //
            // 原来：
            // 0.72 ~ 1.00
            //
            // 现在：
            // 0.92 ~ 1.00
            //
            // 让文字整体更加统一、明亮
            // =================================================

            const randomOpacity =
                0.92 +
                Math.random() *
                0.08;

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

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );

        geometry.computeBoundingSphere();

        // =====================================================
        // Material
        // =====================================================

        const material =
            new THREE.PointsMaterial({

                color:
                    new THREE.Color(color),

                // ★ 提高文字粒子视觉体积
                size:
                    this.textParticleSize,

                transparent: true,

                opacity: 0,

                depthWrite: false,

                depthTest: false,

                blending:
                    THREE.AdditiveBlending,

                sizeAttenuation: true,

                // ★ 不让 ACES Filmic Tone Mapping
                // 把白色文字再次压暗
                toneMapped: false

            });

        // =====================================================
        // Points
        // =====================================================

        const pointsObject =
            new THREE.Points(
                geometry,
                material
            );

        // =====================================================
        // 保存数据
        // =====================================================

        pointsObject.userData.text =
            text;

        pointsObject.userData.color =
            color;

        pointsObject.userData.size =
            size;

        pointsObject.userData.particleAlphas =
            particleAlphas;

        pointsObject.userData.originalPositions =
            originalPositions;

        pointsObject.userData.twinklePhase =
            Math.random() *
            Math.PI *
            2;

        pointsObject.userData.isText =
            true;

        // =====================================================
        // 加入 Group
        // =====================================================

        this.group.add(
            pointsObject
        );

        return pointsObject;

    }


    // =========================================================
    // CREATE STREAK
    //
    // 创建独立流星
    // =========================================================

    createStreak(){

        const canvas =
            document.createElement("canvas");

        canvas.width = 512;
        canvas.height = 32;

        const ctx =
            canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // =====================================================
        // 横向渐变
        //
        // 左边 = 尾巴
        // 右边 = 流星头部
        // =====================================================

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                0
            );

        gradient.addColorStop(
            0,
            "rgba(255,255,255,0)"
        );

        gradient.addColorStop(
            0.35,
            "rgba(255,255,255,0.08)"
        );

        gradient.addColorStop(
            0.72,
            "rgba(255,255,255,0.45)"
        );

        gradient.addColorStop(
            0.92,
            "rgba(255,255,255,0.9)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,1)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // =====================================================
        // 中心亮线
        // =====================================================

        const coreGradient =
            ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                0
            );

        coreGradient.addColorStop(
            0,
            "rgba(255,255,255,0)"
        );

        coreGradient.addColorStop(
            0.65,
            "rgba(255,255,255,0.08)"
        );

        coreGradient.addColorStop(
            0.9,
            "rgba(255,255,255,0.45)"
        );

        coreGradient.addColorStop(
            1,
            "rgba(255,255,255,0.9)"
        );

        ctx.fillStyle =
            coreGradient;

        ctx.fillRect(
            0,
            13,
            canvas.width,
            6
        );

        // =====================================================
        // Texture
        // =====================================================

        this.streakTexture =
            new THREE.CanvasTexture(
                canvas
            );

        this.streakTexture.needsUpdate =
            true;

        this.streakTexture.minFilter =
            THREE.LinearFilter;

        this.streakTexture.magFilter =
            THREE.LinearFilter;

        // =====================================================
        // Geometry
        //
        // 让 position 代表流星头部
        // =====================================================

        const geometry =
            new THREE.PlaneGeometry(
                this.streakLength,
                this.streakWidth
            );

        geometry.translate(
            -this.streakLength / 2,
            0,
            0
        );

        // =====================================================
        // Material
        // =====================================================

        const material =
            new THREE.MeshBasicMaterial({

                map:
                    this.streakTexture,

                color:
                    new THREE.Color(
                        this.streakColor
                    ),

                transparent: true,

                opacity: 0,

                depthWrite: false,

                depthTest: false,

                blending:
                    THREE.AdditiveBlending,

                side:
                    THREE.DoubleSide,

                // ★ 流星保持纯白亮度
                toneMapped: false

            });

        // =====================================================
        // Mesh
        // =====================================================

        this.streak =
            new THREE.Mesh(
                geometry,
                material
            );

        // =====================================================
        // 起始位置
        // =====================================================

        this.streak.position.set(

            this.streakStartX,

            this.streakStartY,

            this.streakZ

        );

        // =====================================================
        // 计算方向
        // =====================================================

        const dx =
            this.streakEndX -
            this.streakStartX;

        const dy =
            this.streakEndY -
            this.streakStartY;

        const angle =
            Math.atan2(
                dy,
                dx
            );

        this.streak.rotation.z =
            angle;

        // =====================================================
        // 初始状态
        // =====================================================

        this.streak.visible =
            false;

        this.streak.scale.set(
            0.8,
            0.8,
            0.8
        );

        this.streak.userData.isStreak =
            true;

        // =====================================================
        // 加入 Group
        // =====================================================

        this.group.add(
            this.streak
        );

    }


    // =========================================================
    // PLAY
    // =========================================================

    play(callback){

        if(this.started){

            return;

        }

        this.started = true;

        const love =
            this.firstLove;

        // =====================================================
        // I LOVE
        // =====================================================

        love.position.set(
            0,
            0,
            0
        );

        // =====================================================
        // I LOVE 淡入
        // =====================================================

        gsap.to(
            love.material,
            {

                opacity:
                    this.textParticleOpacity,

                duration:
                    0.8,

                ease:
                    "power2.out"

            }
        );

        // =====================================================
        // I LOVE 出现
        // =====================================================

        setTimeout(()=>{

            // =================================================
            // I LOVE 淡出
            // =================================================

            gsap.to(
                love.material,
                {

                    opacity: 0,

                    duration:
                        0.55,

                    ease:
                        "power2.inOut"

                }
            );

            // =================================================
            // 创建 I KNOW
            // =================================================

            this.createKnowWords();

            // =================================================
            // 等待 I KNOW 成形
            // =================================================

            setTimeout(()=>{

                this.startDisintegration();

            }, this.disperseDelay * 1000);

            // =================================================
            // 转场
            // =================================================

            setTimeout(()=>{

                callback?.();

            }, 2000);

        }, 1000);

    }


    // =========================================================
    // CREATE KNOW
    // =========================================================

    createKnowWords(){

        if(this.knowWord){

            return;

        }

        this.createSingleKnow();

    }


    // =========================================================
    // CREATE SINGLE KNOW
    // =========================================================

    createSingleKnow(){

        const word =
            this.createText(
                "I KNOW",
                "#ffffff",
                this.knowSize
            );

        const startX =
            this.knowPositionX;

        const startY =
            this.knowPositionY;

        word.position.set(
            startX,
            startY,
            -1
        );

        word.material.opacity = 0;

        this.knowWord =
            word;

        // =====================================================
        // 淡入
        // =====================================================

        gsap.to(
            word.material,
            {

                opacity:
                    this.textParticleOpacity,

                duration:
                    0.5,

                ease:
                    "power2.out"

            }
        );

        // =====================================================
        // 轻微向上稳定
        // =====================================================

        gsap.fromTo(
            word.position,
            {

                y:
                    startY - 0.12

            },
            {

                y:
                    startY,

                duration:
                    0.6,

                ease:
                    "power2.out"

            }
        );

    }


    // =========================================================
    // START DISINTEGRATION
    // =========================================================

    startDisintegration(){

        if(this.trailsStarted){

            return;

        }

        this.trailsStarted = true;

        // =====================================================
        // ★ 流星
        //
        // 与字体解体完全同步
        // =====================================================

        this.launchStreak();

        // =====================================================
        // I LOVE 淡出
        // =====================================================

        if(this.firstLove){

            gsap.to(
                this.firstLove.material,
                {

                    opacity: 0,

                    duration:
                        0.45,

                    ease:
                        "power2.inOut"

                }
            );

        }

        // =====================================================
        // I KNOW 解体
        // =====================================================

        if(this.knowWord){

            this.disintegrateKnow(
                this.knowWord
            );

        }

    }


    // =========================================================
    // LAUNCH STREAK
    //
    // ★ 真正的高速流星
    //
    // 不减速
    // 不停在中央
    // 撞入以后立即消失
    // =========================================================

    launchStreak(){

        if(!this.streak){

            return;

        }

        // =====================================================
        // 停止旧动画
        // =====================================================

        gsap.killTweensOf(
            this.streak.position
        );

        gsap.killTweensOf(
            this.streak.material
        );

        gsap.killTweensOf(
            this.streak.scale
        );

        // =====================================================
        // 重新计算方向
        // =====================================================

        const dx =
            this.streakEndX -
            this.streakStartX;

        const dy =
            this.streakEndY -
            this.streakStartY;

        const angle =
            Math.atan2(
                dy,
                dx
            );

        this.streak.rotation.z =
            angle;

        // =====================================================
        // 回到起点
        // =====================================================

        this.streak.position.set(

            this.streakStartX,

            this.streakStartY,

            this.streakZ

        );

        // =====================================================
        // 初始状态
        // =====================================================

        this.streak.visible =
            true;

        this.streak.material.opacity =
            0;

        this.streak.scale.set(
            0.9,
            0.9,
            0.9
        );

        // =====================================================
        // ★ 快速出现
        // =====================================================

        gsap.to(
            this.streak.material,
            {

                opacity:
                    this.streakOpacity,

                duration:
                    0.06,

                delay:
                    this.streakDelay,

                ease:
                    "power1.out"

            }
        );

        // =====================================================
        // ★ 高速直线飞行
        //
        // 使用 none
        //
        // 不减速
        // 不加速
        // 不在中央停顿
        // =====================================================

        gsap.to(
            this.streak.position,
            {

                x:
                    this.streakEndX,

                y:
                    this.streakEndY,

                duration:
                    this.streakDuration,

                delay:
                    this.streakDelay,

                ease:
                    "none"

            }
        );

        // =====================================================
        // ★ 飞行过程中稍微拉长
        // =====================================================

        gsap.to(
            this.streak.scale,
            {

                x:
                    1.12,

                y:
                    1.12,

                z:
                    1.12,

                duration:
                    this.streakDuration,

                delay:
                    this.streakDelay,

                ease:
                    "none"

            }
        );

        // =====================================================
        // ★ 撞击中央
        //
        // 到达终点之后立刻淡出
        // 不停留
        // =====================================================

        gsap.to(
            this.streak.material,
            {

                opacity: 0,

                duration:
                    this.streakFadeDuration,

                delay:
                    this.streakDelay +
                    this.streakDuration,

                ease:
                    "power2.out",

                onComplete: ()=>{

                    if(this.streak){

                        this.streak.visible =
                            false;

                    }

                }

            }
        );

    }


    // =========================================================
    // DISINTEGRATE KNOW
    // =========================================================

    disintegrateKnow(word){

        const geometry =
            word.geometry;

        const positionAttribute =
            geometry.getAttribute(
                "position"
            );

        const originalCount =
            positionAttribute.count;

        // =====================================================
        // 最终解体星星数量
        // =====================================================

        let finalStarCount =
            this.disintegrationStarCount;

        // =====================================================
        // 是否允许额外星星
        // =====================================================

        if(
            !this.allowExtraDisintegrationStars
        ){

            finalStarCount =
                Math.min(
                    finalStarCount,
                    originalCount
                );

        }

        // =====================================================
        // 防止非法数量
        // =====================================================

        finalStarCount =
            Math.max(
                1,
                Math.floor(
                    finalStarCount
                )
            );

        // =====================================================
        // 创建星轨目标
        // =====================================================

        const trailTargets =
            this.createTrailTargets();

        // =====================================================
        // 每颗解体星星
        // =====================================================

        for(
            let i = 0;
            i < finalStarCount;
            i++
        ){

            // =================================================
            // 均匀分配轨道
            // =================================================

            const trailIndex =
                i %
                trailTargets.length;

            const targetTrail =
                trailTargets[
                    trailIndex
                ];

            // =================================================
            // 当前星星对应文字粒子
            // =================================================

            const sourceIndex =
                i %
                originalCount;

            const currentX =
                positionAttribute.getX(
                    sourceIndex
                );

            const currentY =
                positionAttribute.getY(
                    sourceIndex
                );

            // =================================================
            // 目标索引
            // =================================================

            const normalizedIndex =
                i /
                Math.max(
                    1,
                    finalStarCount - 1
                );

            const targetIndex =
                Math.floor(
                    normalizedIndex *
                    (
                        targetTrail.length - 1
                    )
                );

            const target =
                targetTrail[
                    targetIndex
                ];

            // =================================================
            // 起始位置随机扩散
            // =================================================

            const sourceSpreadX =
                (
                    Math.random() -
                    0.5
                )
                *
                this.disintegrationSpread;

            const sourceSpreadY =
                (
                    Math.random() -
                    0.5
                )
                *
                this.disintegrationSpread;

            const startX =
                word.position.x +
                currentX +
                sourceSpreadX;

            const startY =
                word.position.y +
                currentY +
                sourceSpreadY;

            // =================================================
            // 目标位置
            // =================================================

            const targetX =
                target.x;

            const targetY =
                target.y;

            // =================================================
            // 创建独立星星
            // =================================================

            const starGeometry =
                new THREE.CircleGeometry(

                    this.starSize *
                    (
                        this.disintegrationStarSizeMin +
                        Math.random() *
                        (
                            this.disintegrationStarSizeMax -
                            this.disintegrationStarSizeMin
                        )
                    ),

                    6

                );

            const starMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        0xffffff,

                    transparent:
                        true,

                    opacity:
                        this.textParticleOpacity,

                    depthWrite:
                        false,

                    depthTest:
                        false,

                    blending:
                        THREE.AdditiveBlending,

                    // ★ 解体星星也不被 Tone Mapping 压暗
                    toneMapped:
                        false

                });

            const star =
                new THREE.Mesh(
                    starGeometry,
                    starMaterial
                );

            // =================================================
            // 起始位置
            // =================================================

            star.position.set(

                startX,

                startY,

                -2

            );

            // =================================================
            // 保存轨道信息
            // =================================================

            star.userData.trailIndex =
                trailIndex;

            star.userData.targetX =
                targetX;

            star.userData.targetY =
                targetY;

            star.userData.progress =
                target.progress;

            star.userData.angle =
                target.angle;

            star.userData.radius =
                target.radius;

            star.userData.yScale =
                this.trailYScale;

            star.userData.phase =
                Math.random() *
                Math.PI *
                2;

            star.userData.speed =
                this.rotationSpeed *
                (
                    0.7 +
                    Math.random() *
                    this.speedVariation
                );

            star.userData.brightness =
                0.2 +
                target.progress *
                0.8;

            star.userData.isDisintegrationStar =
                true;

            // =================================================
            // 加入
            // =================================================

            this.group.add(
                star
            );

            this.trails.push(
                star
            );

            // =================================================
            // 解体错峰
            // =================================================

            const delay =
                (
                    i /
                    Math.max(
                        1,
                        finalStarCount - 1
                    )
                )
                *
                this.disintegrationStagger;

            // =================================================
            // 初始缩小
            // =================================================

            star.scale.set(
                0.15,
                0.15,
                0.15
            );

            // =================================================
            // 飞向星轨
            // =================================================

            gsap.to(
                star.position,
                {

                    x:
                        targetX,

                    y:
                        targetY,

                    duration:
                        this.disintegrationDuration,

                    delay:
                        delay,

                    ease:
                        "power3.inOut"

                }
            );

            // =================================================
            // 星星成长
            // =================================================

            gsap.to(
                star.scale,
                {

                    x: 1,

                    y: 1,

                    z: 1,

                    duration:
                        0.8,

                    delay:
                        delay,

                    ease:
                        "power2.out"

                }
            );

            // =================================================
            // 星星出现
            // =================================================

            star.material.opacity =
                0;

            gsap.to(
                star.material,
                {

                    opacity:
                        this.starOpacity *
                        (
                            0.25 +
                            target.progress *
                            0.75
                        ),

                    duration:
                        0.45,

                    delay:
                        delay,

                    ease:
                        "power2.out"

                }
            );

        }

        // =====================================================
        // 原 I KNOW 隐藏
        // =====================================================

        gsap.to(
            word.material,
            {

                opacity: 0,

                duration:
                    0.15,

                delay:
                    0.05,

                ease:
                    "power2.out"

            }
        );

        // =====================================================
        // 删除原始 I KNOW
        // =====================================================

        setTimeout(()=>{

            if(word.parent){

                word.parent.remove(
                    word
                );

            }

            if(word.geometry){

                word.geometry.dispose();

            }

            if(word.material){

                word.material.dispose();

            }

        }, 300);

    }


    // =========================================================
    // CREATE TRAIL TARGETS
    // =========================================================

    createTrailTargets(){

        const trails = [];

        for(
            let i = 0;
            i < this.trailCount;
            i++
        ){

            const points = [];

            const baseAngle =
                (
                    i /
                    this.trailCount
                )
                *
                Math.PI *
                2;

            const curveDirection =
                i % 2 === 0
                    ? 1
                    : -1;

            // =================================================
            // 每条轨道生成目标点
            // =================================================

            for(
                let j = 0;
                j < this.starsPerTrail;
                j++
            ){

                const progress =
                    j /
                    (
                        this.starsPerTrail -
                        1
                    );

                // =================================================
                // 半径
                // =================================================

                const radius =
                    this.minRadius +
                    progress *
                    (
                        this.maxRadius -
                        this.minRadius
                    );

                // =================================================
                // 曲线
                // =================================================

                const curve =
                    (
                        progress *
                        progress
                    )
                    *
                    this.trailCurve
                    *
                    curveDirection;

                const angle =
                    baseAngle +
                    curve;

                // =================================================
                // X
                // =================================================

                let x =
                    Math.cos(angle) *
                    radius;

                // =================================================
                // Y
                // =================================================

                let y =
                    Math.sin(angle) *
                    radius *
                    this.trailYScale;

                // =================================================
                // 中心
                // =================================================

                x +=
                    this.trailCenterX;

                y +=
                    this.trailCenterY;

                // =================================================
                // 随机扰动
                // =================================================

                x +=
                    (
                        Math.random() -
                        0.5
                    )
                    *
                    0.7;

                y +=
                    (
                        Math.random() -
                        0.5
                    )
                    *
                    0.45;

                points.push({

                    x: x,

                    y: y,

                    progress:
                        progress,

                    angle:
                        angle,

                    radius:
                        radius

                });

            }

            trails.push(
                points
            );

        }

        return trails;

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(delta = 0.016){

        this.time += delta;

        // =====================================================
        // 文字闪烁
        // =====================================================

        if(this.enableParticleTwinkle){

            const textObjects =
                this.group.children;

            for(
                let i = 0;
                i < textObjects.length;
                i++
            ){

                const object =
                    textObjects[i];

                if(
                    !object ||
                    !object.userData ||
                    !object.userData.text ||
                    !object.material
                ){

                    continue;

                }

                const baseOpacity =
                    object.material.opacity;

                if(baseOpacity <= 0){

                    continue;

                }

                const phase =
                    object.userData.twinklePhase ||
                    0;

                const twinkle =
                    Math.sin(
                        this.time *
                        this.twinkleSpeed +
                        phase
                    )
                    *
                    this.twinkleAmount;

                object.material.opacity =
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

        // =====================================================
        // 星轨还没开始
        // =====================================================

        if(
            !this.trailsStarted ||
            this.trails.length === 0
        ){

            return;

        }

        // =====================================================
        // 整体旋转
        // =====================================================

        this.group.rotation.z +=
            this.rotationSpeed;

        // =====================================================
        // 星轨运动
        // =====================================================

        for(
            let i = 0;
            i < this.trails.length;
            i++
        ){

            const star =
                this.trails[i];

            if(!star){

                continue;

            }

            const data =
                star.userData;

            // =================================================
            // 轨道漂移
            // =================================================

            data.angle +=
                data.speed *
                0.18;

            // =================================================
            // 呼吸
            // =================================================

            const breathing =
                Math.sin(
                    data.angle *
                    1.7 +
                    data.phase
                )
                *
                0.012;

            const radius =
                data.radius *
                (
                    1 +
                    breathing
                );

            // =================================================
            // X
            // =================================================

            const orbitX =
                this.trailCenterX +
                Math.cos(
                    data.angle
                )
                *
                radius;

            // =================================================
            // Y
            // =================================================

            const orbitY =
                this.trailCenterY +
                Math.sin(
                    data.angle
                )
                *
                radius *
                data.yScale;

            // =================================================
            // 平滑追踪
            // =================================================

            star.position.x +=
                (
                    orbitX -
                    star.position.x
                )
                *
                0.008;

            star.position.y +=
                (
                    orbitY -
                    star.position.y
                )
                *
                0.008;

            // =================================================
            // 深度
            // =================================================

            star.position.z =
                -2 +
                Math.sin(
                    data.angle +
                    data.phase
                )
                *
                0.15;

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
        // 清理 GSAP
        // =====================================================

        gsap.killTweensOf(
            this.group
        );

        if(this.firstLove){

            gsap.killTweensOf(
                this.firstLove.material
            );

            gsap.killTweensOf(
                this.firstLove.position
            );

        }

        if(this.knowWord){

            gsap.killTweensOf(
                this.knowWord.material
            );

            gsap.killTweensOf(
                this.knowWord.position
            );

        }

        // =====================================================
        // 清理流线
        // =====================================================

        if(this.streak){

            gsap.killTweensOf(
                this.streak.position
            );

            gsap.killTweensOf(
                this.streak.material
            );

            gsap.killTweensOf(
                this.streak.scale
            );

            if(this.streak.geometry){

                this.streak.geometry.dispose();

            }

            if(this.streak.material){

                this.streak.material.dispose();

            }

        }

        if(this.streakTexture){

            this.streakTexture.dispose();

            this.streakTexture =
                null;

        }

        // =====================================================
        // 清理星轨星星
        // =====================================================

        for(
            let i = 0;
            i < this.trails.length;
            i++
        ){

            const star =
                this.trails[i];

            if(!star){

                continue;

            }

            if(star.geometry){

                star.geometry.dispose();

            }

            if(star.material){

                star.material.dispose();

            }

        }

        // =====================================================
        // 清理 I LOVE
        // =====================================================

        if(this.firstLove){

            if(this.firstLove.geometry){

                this.firstLove.geometry.dispose();

            }

            if(this.firstLove.material){

                this.firstLove.material.dispose();

            }

        }

        // =====================================================
        // 清理 I KNOW
        // =====================================================

        if(this.knowWord){

            if(this.knowWord.geometry){

                this.knowWord.geometry.dispose();

            }

            if(this.knowWord.material){

                this.knowWord.material.dispose();

            }

        }

        // =====================================================
        // 清理其他 Group 子物体
        // =====================================================

        this.group.traverse(
            (object)=>{

                if(
                    object.geometry &&
                    object !== this.firstLove &&
                    object !== this.knowWord &&
                    object !== this.streak
                ){

                    object.geometry.dispose();

                }

                if(
                    object.material &&
                    object !== this.firstLove &&
                    object !== this.knowWord &&
                    object !== this.streak
                ){

                    object.material.dispose();

                }

            }
        );

        // =====================================================
        // 重置
        // =====================================================

        this.words = [];

        this.trails = [];

        this.firstLove = null;

        this.knowWord = null;

        this.streak = null;

        this.started = false;

        this.trailsStarted = false;

        this.time = 0;

        this.group.clear();

    }

}