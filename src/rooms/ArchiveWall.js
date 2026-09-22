
import * as THREE from "three";

import FileCard from "./FileCard.js";


// =====================================================
// QIN LAB · ARCHIVE WALL FINAL
//
// 四面墙档案系统
//
// 功能：
// 1. 四面墙
// 2. 自动排列
// 3. 六列布局
// 4. 自动换行
// 5. 删除后自动重新排列
// 6. 文件点击
// 7. 文件删除
// 8. 与 Room01 统一数据结构
// =====================================================


export default class ArchiveWall {


    constructor(options = {}){


        this.onOpen =

            options.onOpen || null;


        this.onDelete =

            options.onDelete || null;


        // =================================================
        // MAIN GROUP
        // =================================================

        this.group =

            new THREE.Group();


        // =================================================
        // WALLS
        // =================================================

        this.walls = [];


        this.createWalls();


        // =================================================
        // FILE CARDS
        // =================================================

        this.cards = [];


        // =================================================
        // SETTINGS
        // =================================================

        this.columns = 6;


        this.spacingX = 1.02;


        this.spacingY = 0.78;


        this.startY = 2.45;


        this.maxRows = 9;


        this.cardScale = 0.82;


    }



    // =====================================================
    // CREATE FOUR WALLS
    // =====================================================

    createWalls(){


        // -------------------------------------------------
        // FRONT
        // -------------------------------------------------

        this.walls.push(

            this.createWall(

                "front",

                0,

                0,

                -5.5,

                0

            )

        );


        // -------------------------------------------------
        // BACK
        // -------------------------------------------------

        this.walls.push(

            this.createWall(

                "back",

                0,

                0,

                5.5,

                Math.PI

            )

        );


        // -------------------------------------------------
        // LEFT
        // -------------------------------------------------

        this.walls.push(

            this.createWall(

                "left",

                -5.5,

                0,

                0,

                Math.PI / 2

            )

        );


        // -------------------------------------------------
        // RIGHT
        // -------------------------------------------------

        this.walls.push(

            this.createWall(

                "right",

                5.5,

                0,

                0,

                -Math.PI / 2

            )

        );


    }



    // =====================================================
    // CREATE SINGLE WALL
    // =====================================================

    createWall(

        name,

        x,

        y,

        z,

        rotationY

    ){


        const wall =

            new THREE.Group();


        wall.name =

            `ARCHIVE_WALL_${name.toUpperCase()}`;


        wall.position.set(

            x,

            y,

            z

        );


        wall.rotation.y =

            rotationY;


        this.group.add(

            wall

        );


        return wall;


    }



    // =====================================================
    // SET FILES
    //
    // Room01 会调用：
    //
    // archiveWall.setFiles(savedFiles)
    // =====================================================

    setFiles(files = []){


        this.clear();


        this.cards = [];


        if(!Array.isArray(files)){

            return;

        }


        files.forEach(

            file=>{

                this.addFile(

                    file,

                    false

                );

            }

        );


        this.layout();


    }



    // =====================================================
    // ADD FILE
    // =====================================================

    addFile(

        data,

        shouldLayout = true

    ){


        if(!data){

            return;

        }


        const card =

            new FileCard(

                data,

                (id)=>{

                    this.handleDelete(

                        id

                    );

                },

                (file)=>{

                    this.handleOpen(

                        file

                    );

                }

            );


        // =================================================
        // WALL DISTRIBUTION
        // =================================================

        const index =

            this.cards.length;


        const wallIndex =

            index %

            this.walls.length;


        const wall =

            this.walls[

                wallIndex

            ];


        wall.add(

            card.getObject()

        );


        this.cards.push({

            id:data.id,

            data:data,

            card:card,

            wall:wall,

            wallIndex:wallIndex

        });


        if(shouldLayout){

            this.layout();

        }


    }



    // =====================================================
    // OPEN FILE
    // =====================================================

    handleOpen(file){


        if(this.onOpen){

            this.onOpen(

                file

            );

        }


    }



    // =====================================================
    // DELETE FILE
    // =====================================================

    handleDelete(id){


        if(this.onDelete){

            this.onDelete(

                id

            );

        }


    }



    // =====================================================
    // LAYOUT
    //
    // 每面墙：
    //
    // 6 columns
    //
    // 自动换行
    // =====================================================

    layout(){


        // =================================================
        // FIRST CLEAR WALL POSITIONS
        // =================================================

        this.walls.forEach(

            wall=>{

                // 不清除对象
                // 只重新计算位置

            }

        );


        // =================================================
        // GROUP CARDS BY WALL
        // =================================================

        this.walls.forEach(

            (wall, wallIndex)=>{


                const wallCards =

                    this.cards.filter(

                        item=>

                            item.wallIndex ===

                            wallIndex

                    );


                wallCards.forEach(

                    (item,index)=>{


                        const column =

                            index %

                            this.columns;


                        const row =

                            Math.floor(

                                index /

                                this.columns

                            );


                        // ---------------------------------
                        // CENTER COLUMNS
                        // ---------------------------------

                        const centerOffset =

                            (

                                this.columns - 1

                            ) / 2;


                        const x =

                            (

                                column -

                                centerOffset

                            )

                            *

                            this.spacingX;


                        const y =

                            this.startY -

                            row *

                            this.spacingY;


                        // ---------------------------------
                        // POSITION
                        // ---------------------------------

                        item.card

                            .getObject()

                            .position.set(

                                x,

                                y,

                                0

                            );


                        // ---------------------------------
                        // SCALE
                        // ---------------------------------

                        item.card

                            .getObject()

                            .scale.set(

                                this.cardScale,

                                this.cardScale,

                                this.cardScale

                            );


                    }

                );


            }

        );


    }



    // =====================================================
    // REBUILD
    //
    // 删除文件以后重新平均分配四面墙
    // =====================================================

    rebuild(files = []){


        this.setFiles(

            files

        );


    }



    // =====================================================
    // CLEAR
    // =====================================================

    clear(){


        this.walls.forEach(

            wall=>{


                while(

                    wall.children.length

                ){


                    const child =

                        wall.children.pop();


                    child.traverse?.(

                        object=>{


                            if(

                                object.geometry

                            ){

                                object.geometry.dispose?.();

                            }


                            if(

                                object.material

                            ){


                                if(

                                    Array.isArray(

                                        object.material

                                    )

                                ){


                                    object.material.forEach(

                                        material=>{

                                            material.dispose?.();

                                        }

                                    );

                                }

                                else{

                                    object.material.dispose?.();

                                }


                            }


                        }

                    );


                }


            }

        );


        this.cards = [];


    }



    // =====================================================
    // INTERACTION OBJECTS
    // =====================================================

    getInteractiveObjects(){


        const objects = [];


        this.cards.forEach(

            item=>{


                const cardObjects =

                    item.card

                        .getInteractiveObjects();


                if(

                    Array.isArray(

                        cardObjects

                    )

                ){


                    objects.push(

                        ...cardObjects

                    );

                }


            }

        );


        return objects;


    }



    // =====================================================
    // GET OBJECT
    // =====================================================

    getObject(){


        return this.group;


    }



    // =====================================================
    // UPDATE
    // =====================================================

    update(delta){


        // 当前没有持续动画
        // 保留接口方便以后扩展


    }



    // =====================================================
    // DISPOSE
    // =====================================================

    dispose(){


        this.clear();


        this.group.clear();


        this.walls = [];


    }


}