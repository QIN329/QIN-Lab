
import * as THREE from "three";


// =====================================================
// QIN LAB · FILE CARD FINAL
//
// 墙面档案卡片
//
// 功能：
// 1. 显示文件名
// 2. 显示日期
// 3. 显示文字摘要
// 4. 显示 Word / 图片 / 文本类型
// 5. 点击打开
// 6. 删除文件
// 7. 鼠标悬停高亮
// 8. 与 ArchiveWall 对接
// =====================================================


export default class FileCard {


    constructor(

        data = {},

        onDelete = null,

        onOpen = null

    ){


        // =================================================
        // DATA
        // =================================================

        this.data = {

            id:
                data.id ??
                Date.now(),

            name:
                data.name ||
                "未命名文件",

            text:
                data.text ||
                "",

            image:
                data.image ||
                null,

            file:
                data.file ||
                null,

            fileName:
                data.fileName ||
                "",

            fileType:
                data.fileType ||
                "text",

            time:
                data.time ||
                this.formatDate(

                    new Date()

                )

        };


        // =================================================
        // CALLBACK
        // =================================================

        this.onDelete =

            onDelete;


        this.onOpen =

            onOpen;


        // =================================================
        // THREE GROUP
        // =================================================

        this.group =

            new THREE.Group();


        this.group.name =

            `FILE_CARD_${this.data.id}`;


        // =================================================
        // STATE
        // =================================================

        this.hovered =

            false;


        // =================================================
        // INTERACTIVE OBJECTS
        // =================================================

        this.interactiveObjects = [];


        // =================================================
        // CREATE
        // =================================================

        this.create();


    }



    // =====================================================
    // CREATE
    // =====================================================

    create(){


        this.createPaper();


        this.createShadow();


        this.createTitle();


        this.createDate();


        this.createPreview();


        this.createTypeIcon();


        this.createDeleteButton();


        this.createHitArea();


    }



    // =====================================================
    // PAPER
    // =====================================================

    createPaper(){


        const geometry =

            new THREE.PlaneGeometry(

                0.88,

                0.62

            );


        const material =

            new THREE.MeshStandardMaterial({

                color:
                    0xf5f1e8,

                roughness:
                    0.82,

                metalness:
                    0.0,

                side:
                    THREE.DoubleSide

            });


        this.paper =

            new THREE.Mesh(

                geometry,

                material

            );


        this.paper.position.z =

            0.015;


        this.group.add(

            this.paper

        );


    }



    // =====================================================
    // SHADOW
    // =====================================================

    createShadow(){


        const geometry =

            new THREE.PlaneGeometry(

                0.92,

                0.66

            );


        const material =

            new THREE.MeshBasicMaterial({

                color:
                    0x000000,

                transparent:
                    true,

                opacity:
                    0.16,

                depthWrite:
                    false

            });


        this.shadow =

            new THREE.Mesh(

                geometry,

                material

            );


        this.shadow.position.set(

            0.025,

            -0.025,

            0

        );


        this.group.add(

            this.shadow

        );


    }



    // =====================================================
    // TITLE
    // =====================================================

    createTitle(){


        const title =

            this.data.name ||

            "未命名文件";


        this.titleSprite =

            this.createTextSprite(

                title,

                {

                    fontSize:
                        52,

                    color:
                        "#202020",

                    fontWeight:
                        "600"

                }

            );


        this.titleSprite.scale.set(

            0.66,

            0.14,

            1

        );


        this.titleSprite.position.set(

            -0.02,

            0.22,

            0.04

        );


        this.group.add(

            this.titleSprite

        );


    }



    // =====================================================
    // DATE
    // =====================================================

    createDate(){


        const dateText =

            this.data.time ||

            "";


        this.dateSprite =

            this.createTextSprite(

                dateText,

                {

                    fontSize:
                        30,

                    color:
                        "#8a8a8a",

                    fontWeight:
                        "400"

                }

            );


        this.dateSprite.scale.set(

            0.54,

            0.09,

            1

        );


        this.dateSprite.position.set(

            -0.02,

            0.115,

            0.04

        );


        this.group.add(

            this.dateSprite

        );


    }



    // =====================================================
    // PREVIEW
    // =====================================================

    createPreview(){


        let preview =

            this.data.text ||

            "";


        preview =

            preview

                .replace(

                    /\s+/g,

                    " "

                )

                .trim();


        if(!preview){


            if(this.data.fileName){

                preview =

                    this.data.fileName;

            }

            else{

                preview =

                    "空白文档";

            }


        }


        if(preview.length > 52){


            preview =

                preview.substring(

                    0,

                    52

                ) +

                "...";


        }


        this.previewSprite =

            this.createTextSprite(

                preview,

                {

                    fontSize:
                        30,

                    color:
                        "#555555",

                    fontWeight:
                        "400"

                }

            );


        this.previewSprite.scale.set(

            0.68,

            0.20,

            1

        );


        this.previewSprite.position.set(

            -0.02,

            -0.04,

            0.04

        );


        this.group.add(

            this.previewSprite

        );


    }



    // =====================================================
    // TYPE ICON
    // =====================================================

    createTypeIcon(){


        let icon =

            "TXT";


        const type =

            (

                this.data.fileType ||

                ""

            ).toLowerCase();


        const fileName =

            (

                this.data.fileName ||

                ""

            ).toLowerCase();


        if(

            type.includes("word") ||

            fileName.endsWith(".doc") ||

            fileName.endsWith(".docx")

        ){


            icon =

                "W";


        }

        else if(

            type.includes("image") ||

            fileName.match(

                /\.(jpg|jpeg|png|gif|webp)$/i

            )

        ){


            icon =

                "IMG";


        }

        else if(

            type.includes("pdf") ||

            fileName.endsWith(".pdf")

        ){


            icon =

                "PDF";


        }


        this.typeSprite =

            this.createTextSprite(

                icon,

                {

                    fontSize:
                        36,

                    color:
                        "#ffffff",

                    fontWeight:
                        "700",

                    background:
                        "#58758f"

                }

            );


        this.typeSprite.scale.set(

            0.15,

            0.15,

            1

        );


        this.typeSprite.position.set(

            -0.31,

            0.235,

            0.06

        );


        this.group.add(

            this.typeSprite

        );


    }



    // =====================================================
    // DELETE BUTTON
    // =====================================================

    createDeleteButton(){


        const geometry =

            new THREE.CircleGeometry(

                0.055,

                24

            );


        const material =

            new THREE.MeshBasicMaterial({

                color:
                    0xb95c5c,

                transparent:
                    true,

                opacity:
                    0.88

            });


        this.deleteButton =

            new THREE.Mesh(

                geometry,

                material

            );


        this.deleteButton.position.set(

            0.34,

            0.245,

            0.08

        );


        this.deleteButton.userData.isDeleteButton =

            true;


        this.deleteButton.userData.onClick =

            ()=>{


                this.delete();


            };


        this.group.add(

            this.deleteButton

        );


        this.interactiveObjects.push(

            this.deleteButton

        );


    }



    // =====================================================
    // HIT AREA
    // =====================================================

    createHitArea(){


        const geometry =

            new THREE.PlaneGeometry(

                0.82,

                0.55

            );


        const material =

            new THREE.MeshBasicMaterial({

                transparent:
                    true,

                opacity:
                    0,

                depthWrite:
                    false

            });


        this.hitArea =

            new THREE.Mesh(

                geometry,

                material

            );


        this.hitArea.position.z =

            0.10;


        this.hitArea.userData.isFileCard =

            true;


        this.hitArea.userData.fileId =

            this.data.id;


        this.hitArea.userData.file =

            this.data;


        this.hitArea.userData.onClick =

            ()=>{


                this.open();


            };


        this.hitArea.userData.onHover =

            ()=>{


                this.setHover(

                    true

                );


            };


        this.hitArea.userData.onLeave =

            ()=>{


                this.setHover(

                    false

                );


            };


        this.group.add(

            this.hitArea

        );


        this.interactiveObjects.push(

            this.hitArea

        );


    }



    // =====================================================
    // CREATE TEXT SPRITE
    // =====================================================

    createTextSprite(

        text,

        options = {}

    ){


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


        const fontSize =

            options.fontSize ||

            42;


        const fontWeight =

            options.fontWeight ||

            "400";


        ctx.font =

            `${fontWeight} ${fontSize}px Arial, sans-serif`;


        ctx.textAlign =

            "center";


        ctx.textBaseline =

            "middle";


        // -------------------------------------------------
        // BACKGROUND
        // -------------------------------------------------

        if(options.background){


            ctx.fillStyle =

                options.background;


            ctx.fillRect(

                0,

                0,

                canvas.width,

                canvas.height

            );


        }


        // -------------------------------------------------
        // TEXT
        // -------------------------------------------------

        ctx.fillStyle =

            options.color ||

            "#ffffff";


        ctx.fillText(

            text,

            canvas.width / 2,

            canvas.height / 2

        );


        const texture =

            new THREE.CanvasTexture(

                canvas

            );


        texture.colorSpace =

            THREE.SRGBColorSpace;


        texture.needsUpdate =

            true;


        const material =

            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthWrite:
                    false

            });


        const sprite =

            new THREE.Sprite(

                material

            );


        sprite.userData.canvas =

            canvas;


        sprite.userData.texture =

            texture;


        return sprite;


    }



    // =====================================================
    // OPEN FILE
    // =====================================================

    open(){


        if(this.onOpen){

            this.onOpen(

                this.data

            );

        }


    }



    // =====================================================
    // DELETE
    // =====================================================

    delete(){


        if(this.onDelete){

            this.onDelete(

                this.data.id

            );

        }


    }



    // =====================================================
    // HOVER
    // =====================================================

    setHover(active){


        this.hovered =

            active;


        if(!this.paper){

            return;

        }


        if(active){


            this.paper.material.color.set(

                0xffffff

            );


            this.group.scale.set(

                0.86,

                0.86,

                0.86

            );


            this.deleteButton.material.opacity =

                1;


        }

        else{


            this.paper.material.color.set(

                0xf5f1e8

            );


            this.group.scale.set(

                0.82,

                0.82,

                0.82

            );


            this.deleteButton.material.opacity =

                0.88;


        }


    }



    // =====================================================
    // GET INTERACTIVE OBJECTS
    // =====================================================

    getInteractiveObjects(){


        return this.interactiveObjects;


    }



    // =====================================================
    // GET OBJECT
    // =====================================================

    getObject(){


        return this.group;


    }



    // =====================================================
    // FORMAT DATE
    // =====================================================

    formatDate(date){


        if(!(date instanceof Date)){

            date =

                new Date(date);

        }


        if(

            Number.isNaN(

                date.getTime()

            )

        ){

            return "";

        }


        const year =

            date.getFullYear();


        const month =

            String(

                date.getMonth() + 1

            ).padStart(

                2,

                "0"

            );


        const day =

            String(

                date.getDate()

            ).padStart(

                2,

                "0"

            );


        const hour =

            String(

                date.getHours()

            ).padStart(

                2,

                "0"

            );


        const minute =

            String(

                date.getMinutes()

            ).padStart(

                2,

                "0"

            );


        return `${year}-${month}-${day} ${hour}:${minute}`;


    }



    // =====================================================
    // DISPOSE
    // =====================================================

    dispose(){


        this.group.traverse(

            object=>{


                if(object.geometry){

                    object.geometry.dispose?.();

                }


                if(object.material){


                    if(

                        Array.isArray(

                            object.material

                        )

                    ){


                        object.material.forEach(

                            material=>{

                                if(material.map){

                                    material.map.dispose?.();

                                }

                                material.dispose?.();

                            }

                        );

                    }

                    else{


                        if(object.material.map){

                            object.material.map.dispose?.();

                        }


                        object.material.dispose?.();


                    }


                }


            }

        );


        this.group.clear();


        this.interactiveObjects = [];


    }


}