import * as THREE from "three";



export default class Stars {



    constructor(){



        // =====================================================
        // 主容器
        // =====================================================

        this.group =
            new THREE.Group();



        // =====================================================
        // 背景星星
        // =====================================================

        this.stars = null;



        // =====================================================
        // 流星系统
        // =====================================================

        this.meteors = [];



        // =====================================================
        // 背景星星数量
        // =====================================================

        this.starCount = 1200;



        // =====================================================
        // 流星数量
        //
        // 每次随机出现：
        //
        // 4 ～ 6 条
        // =====================================================

        this.meteorMinCount = 4;

        this.meteorMaxCount = 6;



        // =====================================================
        // 流星出现间隔
        //
        // 单位：秒
        // =====================================================

        this.meteorMinInterval = 2.0;

        this.meteorMaxInterval = 5.0;



        // =====================================================
        // 流星长度
        // =====================================================

        this.meteorMinLength = 1.8;

        this.meteorMaxLength = 4.5;



        // =====================================================
        // 流星速度
        // =====================================================

        this.meteorMinSpeed = 8;

        this.meteorMaxSpeed = 15;



        // =====================================================
        // 流星亮度
        // =====================================================

        this.meteorMinOpacity = 0.25;

        this.meteorMaxOpacity = 0.7;



        // =====================================================
        // 流星线条宽度
        // =====================================================

        this.meteorWidth = 0.012;



        // =====================================================
        // 流星颜色
        //
        // 现在是接近白色的冷光
        // =====================================================

        this.meteorColor = 0xffffff;



        // =====================================================
        // 流星出现区域
        //
        // 控制流星从哪里进入
        // =====================================================

        this.meteorMinX = -20;

        this.meteorMaxX = 20;



        this.meteorMinY = 5;

        this.meteorMaxY = 18;



        // =====================================================
        // 流星 Z 深度
        //
        // 数字越大越远
        // =====================================================

        this.meteorZ = -5;



        // =====================================================
        // 流星方向
        //
        // 越大越倾斜
        // =====================================================

        this.meteorAngleMin = -0.55;

        this.meteorAngleMax = -0.25;



        // =====================================================
        // 时间
        // =====================================================

        this.time = 0;



        // =====================================================
        // 下一次流星出现时间
        // =====================================================

        this.nextMeteorTime = 1.5;



        // =====================================================
        // 创建
        // =====================================================

        this.create();


    }





    // =========================================================
    // CREATE
    // =========================================================

    create(){



        this.createBackgroundStars();


    }





    // =========================================================
    // 创建背景星星
    // =========================================================

    createBackgroundStars(){



        const count =
            this.starCount;



        const geometry =
            new THREE.BufferGeometry();



        const positions =
            new Float32Array(
                count * 3
            );



        for(

            let i = 0;

            i < count;

            i++

        ){



            const radius =
                30 +
                Math.random() * 40;



            const theta =
                Math.random() *
                Math.PI *
                2;



            const phi =
                Math.acos(
                    Math.random() * 2 - 1
                );



            positions[i * 3] =

                radius *

                Math.sin(phi) *

                Math.cos(theta);



            positions[i * 3 + 1] =

                radius *

                Math.sin(phi) *

                Math.sin(theta);



            positions[i * 3 + 2] =

                radius *

                Math.cos(phi);



        }





        geometry.setAttribute(

            "position",

            new THREE.BufferAttribute(

                positions,

                3

            )

        );





        // =====================================================
        // 背景星星材质
        //
        // 提亮版本
        //
        // 0.8 → 0.95
        // 0.08 → 0.11
        //
        // AdditiveBlending 让星星拥有更明显的冷白发光感
        // =====================================================

        const material =

            new THREE.PointsMaterial({

                color:
                    0xffffff,

                size:
                    0.11,

                transparent:
                    true,

                opacity:
                    0.95,

                depthWrite:
                    false,

                depthTest:
                    false,

                blending:
                    THREE.AdditiveBlending,

                sizeAttenuation:
                    true

            });





        this.stars =

            new THREE.Points(

                geometry,

                material

            );



        this.group.add(

            this.stars

        );


    }





    // =========================================================
    // START
    // =========================================================

    start(){



        // =====================================================
        // 第一次流星稍微延迟出现
        // =====================================================

        this.time = 0;



        this.nextMeteorTime =

            1.2 +

            Math.random() * 2;



    }





    // =========================================================
    // 创建随机流星
    // =========================================================

    createMeteor(){



        // =====================================================
        // 随机起始位置
        // =====================================================

        const startX =

            this.meteorMinX +

            Math.random() *

            (

                this.meteorMaxX -

                this.meteorMinX

            );



        const startY =

            this.meteorMinY +

            Math.random() *

            (

                this.meteorMaxY -

                this.meteorMinY

            );



        // =====================================================
        // 随机长度
        // =====================================================

        const length =

            this.meteorMinLength +

            Math.random() *

            (

                this.meteorMaxLength -

                this.meteorMinLength

            );



        // =====================================================
        // 随机速度
        // =====================================================

        const speed =

            this.meteorMinSpeed +

            Math.random() *

            (

                this.meteorMaxSpeed -

                this.meteorMinSpeed

            );



        // =====================================================
        // 随机亮度
        // =====================================================

        const opacity =

            this.meteorMinOpacity +

            Math.random() *

            (

                this.meteorMaxOpacity -

                this.meteorMinOpacity

            );



        // =====================================================
        // 随机角度
        // =====================================================

        const angle =

            this.meteorAngleMin +

            Math.random() *

            (

                this.meteorAngleMax -

                this.meteorAngleMin

            );



        // =====================================================
        // 流星方向
        // =====================================================

        const directionX =

            Math.cos(angle);



        const directionY =

            Math.sin(angle);



        // =====================================================
        // 流星尾巴
        //
        // 从尾部到头部
        // =====================================================

        const tailX =

            startX -

            directionX *

            length;



        const tailY =

            startY -

            directionY *

            length;



        // =====================================================
        // 创建几何
        // =====================================================

        const geometry =

            new THREE.BufferGeometry();



        const positions =

            new Float32Array([

                tailX,

                tailY,

                this.meteorZ,



                startX,

                startY,

                this.meteorZ

            ]);



        geometry.setAttribute(

            "position",

            new THREE.BufferAttribute(

                positions,

                3

            )

        );



        // =====================================================
        // 流星材质
        // =====================================================

        const material =

            new THREE.LineBasicMaterial({

                color:
                    this.meteorColor,

                transparent:
                    true,

                opacity:
                    0,

                depthWrite:
                    false,

                depthTest:
                    false,

                blending:
                    THREE.AdditiveBlending

            });



        // =====================================================
        // 创建线条
        // =====================================================

        const meteor =

            new THREE.Line(

                geometry,

                material

            );



        meteor.userData = {

            velocityX:
                directionX * speed,

            velocityY:
                directionY * speed,

            opacity:
                opacity,

            life:
                0,

            maxLife:
                0.75 +

                Math.random() * 0.7,

            fadeIn:
                0.12,

            fadeOut:
                0.35,

            length:
                length,

            directionX:
                directionX,

            directionY:
                directionY,

            startX:
                startX,

            startY:
                startY

        };



        meteor.position.set(

            0,

            0,

            0

        );



        this.group.add(

            meteor

        );



        this.meteors.push(

            meteor

        );


    }





    // =========================================================
    // 随机生成一组流星
    // =========================================================

    spawnMeteorGroup(){



        const count =

            Math.floor(

                this.meteorMinCount +

                Math.random() *

                (

                    this.meteorMaxCount -

                    this.meteorMinCount +

                    1

                )

            );



        // =====================================================
        // 注意：
        //
        // 不是所有流星同时出现
        //
        // 会产生一点点时间错位
        // =====================================================

        for(

            let i = 0;

            i < count;

            i++

        ){



            setTimeout(

                () => {

                    this.createMeteor();

                },

                Math.random() * 1400

            );

        }


    }





    // =========================================================
    // UPDATE
    // =========================================================

    update(delta){



        // =====================================================
        // 时间
        // =====================================================

        this.time += delta;



        // =====================================================
        // 背景星星缓慢旋转
        // =====================================================

        if(this.stars){



            this.stars.rotation.y +=

                delta * 0.01;



        }



        // =====================================================
        // 是否生成新的流星
        // =====================================================

        if(

            this.time >=

            this.nextMeteorTime

        ){



            this.spawnMeteorGroup();



            // =================================================
            // 下一次出现
            // =================================================

            this.nextMeteorTime =

                this.time +

                this.meteorMinInterval +

                Math.random() *

                (

                    this.meteorMaxInterval -

                    this.meteorMinInterval

                );



        }



        // =====================================================
        // 更新流星
        // =====================================================

        for(

            let i =

                this.meteors.length - 1;

            i >= 0;

            i--

        ){



            const meteor =

                this.meteors[i];



            if(!meteor){

                continue;

            }



            const data =

                meteor.userData;



            // =================================================
            // 生命周期
            // =================================================

            data.life += delta;



            // =================================================
            // 移动
            // =================================================

            meteor.position.x +=

                data.velocityX *

                delta;



            meteor.position.y +=

                data.velocityY *

                delta;



            // =================================================
            // 当前生命周期比例
            // =================================================

            const progress =

                data.life /

                data.maxLife;



            // =================================================
            // 淡入淡出
            // =================================================

            let opacity = 0;



            if(

                progress <

                data.fadeIn

            ){



                opacity =

                    (

                        progress /

                        data.fadeIn

                    )

                    *

                    data.opacity;



            }

            else if(

                progress >

                1 -

                data.fadeOut

            ){



                const fadeProgress =

                    (

                        progress -

                        (

                            1 -

                            data.fadeOut

                        )

                    )

                    /

                    data.fadeOut;



                opacity =

                    (

                        1 -

                        fadeProgress

                    )

                    *

                    data.opacity;



            }

            else {



                opacity =

                    data.opacity;



            }



            meteor.material.opacity =

                Math.max(

                    0,

                    Math.min(

                        data.opacity,

                        opacity

                    )

                );



            // =================================================
            // 尾巴长度轻微变化
            //
            // 让它不是机械的固定线条
            // =================================================

            const currentLength =

                data.length *

                (

                    0.75 +

                    progress * 0.35

                );



            const directionX =

                data.directionX;



            const directionY =

                data.directionY;



            const headX =

                meteor.position.x +

                data.startX;



            const headY =

                meteor.position.y +

                data.startY;



            const tailX =

                headX -

                directionX *

                currentLength;



            const tailY =

                headY -

                directionY *

                currentLength;



            const positionAttribute =

                meteor.geometry.getAttribute(

                    "position"

                );



            positionAttribute.setXYZ(

                0,

                tailX,

                tailY,

                this.meteorZ

            );



            positionAttribute.setXYZ(

                1,

                headX,

                headY,

                this.meteorZ

            );



            positionAttribute.needsUpdate =

                true;



            // =================================================
            // 生命周期结束
            // =================================================

            if(

                data.life >=

                data.maxLife

            ){



                this.group.remove(

                    meteor

                );



                if(

                    meteor.geometry

                ){

                    meteor.geometry.dispose();

                }



                if(

                    meteor.material

                ){

                    meteor.material.dispose();

                }



                this.meteors.splice(

                    i,

                    1

                );



            }


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
        // 清理背景星星
        // =====================================================

        if(this.stars){



            if(this.stars.geometry){

                this.stars.geometry.dispose();

            }



            if(this.stars.material){

                this.stars.material.dispose();

            }



        }



        // =====================================================
        // 清理所有流星
        // =====================================================

        for(

            let i = 0;

            i < this.meteors.length;

            i++

        ){



            const meteor =

                this.meteors[i];



            if(!meteor){

                continue;

            }



            if(meteor.geometry){

                meteor.geometry.dispose();

            }



            if(meteor.material){

                meteor.material.dispose();

            }


        }



        // =====================================================
        // 清空
        // =====================================================

        this.meteors = [];



        this.stars = null;



        this.group.clear();


    }


}