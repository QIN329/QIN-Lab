import * as THREE from "three";


// =====================================================
// QIN LAB
//
// PortalTexture V5 FINAL
//
// WORLD SURFACE SYSTEM
//
// 七个入口 = 七种世界纹理
//
// 0 岩浆
// 1 木纹
// 2 黄金
// 3 森林
// 4 海洋
// 5 星云
// 6 晶体
//
// =====================================================


export default class PortalTexture {



    constructor(options = {}){


        this.color =
            options.color || 0xffffff;


        this.type =
            options.type ?? 0;



        this.width =
            options.width || 1024;


        this.height =
            options.height || 256;




        // ================================
        // Animation
        // ================================


        this.time = 0;


        this.active = 1;



        // ================================
        // Canvas
        // ================================


        this.canvas =
            document.createElement(
                "canvas"
            );


        this.canvas.width =
            this.width * 60;


        this.canvas.height =
            this.height * 60;



        this.ctx =
            this.canvas.getContext(
                "2d"
            );




        // ================================
        // Texture
        // ================================


        this.texture =
            new THREE.CanvasTexture(
                this.canvas
            );


        this.texture.colorSpace =
            THREE.SRGBColorSpace;


        this.texture.wrapS =
            THREE.RepeatWrapping;


        this.texture.wrapT =
            THREE.RepeatWrapping;



        this.texture.minFilter =
            THREE.LinearFilter;



        this.texture.magFilter =
            THREE.LinearFilter;



        this.texture.needsUpdate =
            true;




        // ================================
        // Material
        // ================================


        this.material =
            new THREE.MeshBasicMaterial({

                map:this.texture,


                transparent:true,


                opacity:1,


                side:
                THREE.DoubleSide


            });






        // ================================
        // Mesh
        // ================================


        this.mesh =
            new THREE.Mesh(

                new THREE.PlaneGeometry(

                    this.width,

                    this.height

                ),

                this.material

            );





        this.initNoise();



        this.render();

    }






    // =====================================================
    // NOISE SYSTEM
    //
    // 自然纹理基础
    // =====================================================


    initNoise(){


        this.noise = [];



        const size =
            128;



        for(let y=0;y<size;y++){


            this.noise[y]=[];


            for(let x=0;x<size;x++){


                this.noise[y][x] =
                    Math.random();


            }


        }



    }






    // =====================================================
    // SMOOTH NOISE
    //
    // 平滑自然变化
    // =====================================================


    getNoise(x,y){



        const size =
            this.noise.length;



        x =
        Math.abs(
            Math.floor(x)
        )
        %
        size;



        y =
        Math.abs(
            Math.floor(y)
        )
        %
        size;



        return this.noise[y][x];

    }






    // =====================================================
    // DRAW
    // =====================================================


    render(){


        switch(this.type){


            case 0:

                this.drawLava();

                break;



            case 1:

                this.drawWood();

                break;



            case 2:

                this.drawGold();

                break;



            case 3:

                this.drawForest();

                break;



            case 4:

                this.drawWater();

                break;



            case 5:

                this.drawGalaxy();

                break;



            case 6:

                this.drawCrystal();

                break;


        }



        this.texture.needsUpdate =
            true;


    }
    // =====================================================
// LAVA
//
// 岩浆岩层
// =====================================================


drawLava(){


    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );


    const data =
        image.data;



    for(let y=0;y<h;y++){



        for(let x=0;x<w;x++){



            const wave =

            Math.sin(

                x*0.012 +

                this.time*1.5

            )

            +

            Math.sin(

                y*0.018 +

                this.time

            );




            const noise =

            this.getNoise(

                x*0.04 +

                this.time*2,

                y*0.04

            );




            const value =

            (

                wave +

                noise*2

            )

            /3;




            let r =
                170 +

                value*80;



            let g =
                20 +

                value*80;



            let b =
                10;



            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;


        }


    }



    ctx.putImageData(

        image,

        0,

        0

    );



}








// =====================================================
// WOOD
//
// 木质纤维纹理
// =====================================================


drawWood(){


    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );


    const data =
        image.data;




    for(let y=0;y<h;y++){



        for(let x=0;x<w;x++){



            const grain =


            Math.sin(

                x*0.025 +

                Math.sin(

                    y*0.01

                )

                +

                this.time*0.3

            );




            const noise =

            this.getNoise(

                x*0.03,

                y*0.03

            );




            let r =

            90 +

            grain*35 +

            noise*35;



            let g =

            45 +

            grain*20 +

            noise*20;



            let b =

            20 +

            noise*15;



            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;



        }

    }



    ctx.putImageData(

        image,

        0,

        0

    );



}








// =====================================================
// GOLD
//
// 金属矿物纹理
// =====================================================


drawGold(){



    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );


    const data =
        image.data;




    for(let y=0;y<h;y++){



        for(let x=0;x<w;x++){



            const noise =

            this.getNoise(

                x*0.06 +

                this.time,

                y*0.06

            );




            const shine =


            Math.sin(

                x*0.02 +

                this.time*2

            );




            let r =
                180 +

                shine*30;


            let g =
                130 +

                noise*80;


            let b =
                20 +

                noise*20;



            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;



        }


    }



    ctx.putImageData(

        image,

        0,

        0

    );



}

// =====================================================
// FOREST
//
// 生命纹理
// 叶脉 + 苔藓结构
// =====================================================


drawForest(){


    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );


    const data =
        image.data;



    for(let y=0;y<h;y++){


        for(let x=0;x<w;x++){



            const wave =

            Math.sin(

                x*0.015 +

                y*0.02 +

                this.time*0.4

            );



            const noise =

            this.getNoise(

                x*0.04,

                y*0.04

            );




            let r =

            20 +

            noise*35;



            let g =

            70 +

            wave*20 +

            noise*80;



            let b =

            25 +

            noise*40;





            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;


        }


    }



    ctx.putImageData(

        image,

        0,

        0

    );


}








// =====================================================
// WATER
//
// 海洋 / 冰层
// =====================================================


drawWater(){



    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );



    const data =
        image.data;




    for(let y=0;y<h;y++){



        for(let x=0;x<w;x++){



            const wave =


            Math.sin(

                x*0.025 +

                this.time*1.2

            )

            +

            Math.cos(

                y*0.035 +

                this.time

            );





            const noise =

            this.getNoise(

                x*0.05,

                y*0.05

            );





            let r =

            5 +

            noise*15;



            let g =

            80 +

            wave*15 +

            noise*40;



            let b =

            150 +

            noise*90;





            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;



        }


    }



    ctx.putImageData(

        image,

        0,

        0

    );


}








// =====================================================
// GALAXY
//
// 星云
// =====================================================


drawGalaxy(){



    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;




    ctx.fillStyle =
        "#090022";



    ctx.fillRect(

        0,

        0,

        w,

        h

    );





    for(let i=0;i<250;i++){



        const angle =

        i*0.35 +

        this.time*0.2;



        const radius =

        (

            i*13

        )

        %

        w;





        const x =

        w/2 +

        Math.cos(angle)

        *

        radius;



        const y =

        h/2 +

        Math.sin(angle)

        *

        radius*0.35;





        const alpha =

        0.3 +

        Math.sin(

            this.time+i

        )

        *

        0.3;





        ctx.fillStyle =

        `rgba(220,200,255,${alpha})`;





        ctx.beginPath();



        ctx.arc(

            x,

            y,

            2,

            0,

            Math.PI*2

        );



        ctx.fill();



    }



}








// =====================================================
// CRYSTAL
//
// 晶体折射
// =====================================================


drawCrystal(){



    const ctx =
        this.ctx;


    const w =
        this.canvas.width;


    const h =
        this.canvas.height;



    const image =
        ctx.createImageData(

            w,

            h

        );



    const data =
        image.data;



    for(let y=0;y<h;y++){



        for(let x=0;x<w;x++){



            const wave =

            Math.sin(

                x*0.018 +

                y*0.012 +

                this.time

            );





            const noise =

            this.getNoise(

                x*0.04,

                y*0.04

            );





            let r =

            80 +

            wave*50;



            let g =

            20 +

            noise*60;



            let b =

            130 +

            noise*100;





            const index =

            (

                y*w+x

            )

            *4;



            data[index] =
                r;


            data[index+1] =
                g;


            data[index+2] =
                b;


            data[index+3] =
                255;



        }


    }



    ctx.putImageData(

        image,

        0,

        0

    );



}
// =====================================================
// UPDATE
//
// 动态纹理循环
// =====================================================


update(delta){



    this.time +=

    delta *

    this.active;




    this.render();



}









// =====================================================
// ACTIVE
//
// 外部控制入口状态
// =====================================================


setActive(value){



    this.active =

    THREE.MathUtils.lerp(

        this.active,

        value,

        0.08

    );



}









// =====================================================
// HOVER EFFECT
//
// 鼠标靠近时增强纹理
// =====================================================


setHover(active){



    if(active){


        this.setActive(

            2.5

        );


        this.material.opacity =

        1;



    }

    else{


        this.setActive(

            1

        );


        this.material.opacity =

        0.92;



    }


}









// =====================================================
// OBJECT
// =====================================================


getObject(){


    return this.mesh;


}









// =====================================================
// RESIZE
//
// 防止窗口变化纹理异常
// =====================================================


resize(width,height){



    this.width =
        width;



    this.height =
        height;



    this.mesh.scale.set(

        width,

        height,

        1

    );


}









// =====================================================
// DISPOSE
// =====================================================


dispose(){



    if(this.texture){


        this.texture.dispose();


    }




    if(this.material){


        this.material.dispose();


    }




    if(this.mesh.geometry){


        this.mesh.geometry.dispose();


    }



}






}