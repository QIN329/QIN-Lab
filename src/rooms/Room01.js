import * as THREE from "three";


export default class Room01 {


constructor(events){


    this.events =
        events;



    // =====================================================
    // GROUP
    // =====================================================


    this.group =
        new THREE.Group();



    this.active =
        false;



    this.time =
        0;



    // =====================================================
    // COLOR SYSTEM
    // =====================================================


    this.colors = {


        background:
            0xCBC8E7,


        card:
            0xEFC1C1,


        gray:
            0xADADAD,


        light:
            0xDCDADD,


        warm:
            0xF9C287



    };



    // =====================================================
    // DATA
    // =====================================================


    this.storageKey =
        "room01_archive_files";



    this.savedFiles =
        this.loadFiles();



    this.editingFileId =
        null;



    this.openedFileId =
        null;



    // =====================================================
    // UI
    // =====================================================


    this.uiContainer =
        null;


    this.createButton =
        null;


    this.editorPanel =
        null;


    this.viewerPanel =
        null;



    this.uiCreated =
        false;



    // =====================================================
    // FILE SYSTEM
    // =====================================================


    this.fileGroup =
        new THREE.Group();



    this.fileGroup.name =
        "ROOM01_ARCHIVE_GROUP";



    this.group.add(
        this.fileGroup
    );



    this.fileObjects =
        [];



    // =====================================================
    // CREATE
    // =====================================================


    this.create();



}



// =========================================================
// CREATE ROOM
// =========================================================


create(){



    this.createLights();



    this.createRoomEnvironment();



    this.createFileWall();



}



// =========================================================
// LIGHT SYSTEM
// =========================================================


createLights(){



    /*
    
    ROOM01 不使用太阳光。

    氛围由颜色系统决定，
    不模拟真实房间。

    */


    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1
        );



    this.group.add(
        ambient
    );



}



// =========================================================
// ROOM ENVIRONMENT
// =========================================================


createRoomEnvironment(){



    const floorGeometry =
        new THREE.PlaneGeometry(
            24,
            24
        );



    const floorMaterial =
        new THREE.MeshStandardMaterial({

            color:
                this.colors.background,


            roughness:
                1,


            metalness:
                0


        });



    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );



    floor.rotation.x =
        -Math.PI / 2;



    floor.position.y =
        -1.5;



    floor.name =
        "ROOM01_BACKGROUND";



    this.group.add(
        floor
    );



}



// =========================================================
// FILE WALL
// =========================================================


createFileWall(){



    this.renderFileObjects();



}



// =========================================================
// LOAD FILES
// =========================================================


loadFiles(){


    try{


        const data =
            localStorage.getItem(
                this.storageKey
            );



        if(!data){

            return [];

        }



        const result =
            JSON.parse(
                data
            );



        if(
            !Array.isArray(result)
        ){

            return [];

        }



        return result;



    }
    catch(error){



        console.warn(
            "ROOM01 文件读取失败",
            error
        );



        return [];



    }



}



// =========================================================
// SAVE FILES
// =========================================================


saveFiles(){


    try{


        localStorage.setItem(
            this.storageKey,
            JSON.stringify(
                this.savedFiles
            )
        );



    }
    catch(error){



        console.warn(
            "ROOM01 文件保存失败",
            error
        );



    }



}



// =========================================================
// START ROOM
// =========================================================


start(){



    this.active =
        true;



    this.createUI();



    this.showUI();



    this.renderFileObjects();



}



// =========================================================
// UPDATE
// =========================================================


update(delta){



    if(!this.active){

        return;

    }



    this.time +=
        delta;



}



// =========================================================
// GET OBJECT
// =========================================================


getObject(){



    return this.group;



}



// =========================================================
// INTERACTIVE OBJECTS
// =========================================================


getInteractiveObjects(){



    if(!this.active){

        return [];

    }



    const objects =
        [];



    this.fileObjects.forEach(
        card=>{


            card.traverse(
                child=>{


                    if(
                        child.isMesh ||
                        child.isSprite
                    ){


                        objects.push(
                            child
                        );


                    }


                }
            );



        }
    );



    return objects;



}

// =========================================================
// CREATE UI
// =========================================================


createUI(){



    if(this.uiCreated){

        return;

    }



    this.uiCreated =
        true;



    this.uiContainer =
        document.createElement(
            "div"
        );



    this.uiContainer.id =
        "room01-ui";



    this.uiContainer.style.cssText = `

        position:fixed;

        inset:0;

        pointer-events:none;

        z-index:99999;

        font-family:
        Arial,
        sans-serif;

    `;



    document.body.appendChild(
        this.uiContainer
    );



    // =====================================================
    // CREATE BUTTON
    // =====================================================


    this.createButton =
        document.createElement(
            "button"
        );



    this.createButton.innerHTML =
        "＋ 新建档案";



    this.createButton.style.cssText = `

        position:absolute;

        right:32px;

        bottom:32px;

        padding:12px 20px;

        border:none;

        border-radius:12px;

        background:#EFC1C1;

        color:#ADADAD;

        cursor:pointer;

        pointer-events:auto;

        box-shadow:
        0 10px 30px rgba(0,0,0,.12);

    `;



    this.createButton.onclick =
        ()=>{


            this.showEditor();


        };



    this.uiContainer.appendChild(
        this.createButton
    );



    this.createEditor();



    this.createViewer();



}



// =========================================================
// CREATE EDITOR
// =========================================================


createEditor(){



    this.editorPanel =
        document.createElement(
            "div"
        );



    this.editorPanel.style.cssText = `

        display:none;

        position:absolute;

        left:50%;

        top:50%;

        transform:
        translate(-50%,-50%);

        width:520px;

        padding:30px;

        background:#DCDADD;

        border-radius:18px;

        pointer-events:auto;

        box-shadow:
        0 30px 80px rgba(0,0,0,.2);

        color:#ADADAD;

    `;



    this.editorPanel.innerHTML = `


        <h2>

        新建档案

        </h2>



        <input

        id="room01-name"

        placeholder="文件名"

        style="

        width:100%;

        padding:12px;

        margin-bottom:12px;

        border:none;

        border-radius:10px;

        "

        />




        <textarea

        id="room01-content"

        placeholder="写下内容"

        style="

        width:100%;

        height:180px;

        padding:12px;

        border:none;

        border-radius:10px;

        "

        ></textarea>



        <br><br>



        <input

        id="room01-file"

        type="file"

        accept="image/*,.doc,.docx"

        />



        <br><br>




        <button

        id="room01-save"

        >

        保存档案

        </button>




        <button

        id="room01-cancel"

        >

        取消

        </button>


    `;



    this.uiContainer.appendChild(
        this.editorPanel
    );




    this.editorPanel
    .querySelector(
        "#room01-save"
    )
    .onclick =
    ()=>{


        this.saveEditor();



    };




    this.editorPanel
    .querySelector(
        "#room01-cancel"
    )
    .onclick =
    ()=>{


        this.hideEditor();



    };


}



// =========================================================
// SHOW EDITOR
// =========================================================


showEditor(file=null){



    this.hideViewer();



    this.editorPanel.style.display =
        "block";



    if(file){


        this.editingFileId =
            file.id;



        this.editorPanel
        .querySelector(
            "#room01-name"
        )
        .value =
            file.name;



        this.editorPanel
        .querySelector(
            "#room01-content"
        )
        .value =
            file.text || "";



    }
    else{


        this.editingFileId =
            null;



        this.editorPanel
        .querySelector(
            "#room01-name"
        )
        .value =
            "";



        this.editorPanel
        .querySelector(
            "#room01-content"
        )
        .value =
            "";



    }



}



// =========================================================
// HIDE EDITOR
// =========================================================


hideEditor(){



    this.editorPanel.style.display =
        "none";



}



// =========================================================
// SAVE EDITOR
// =========================================================


async saveEditor(){



    const name =
        this.editorPanel
        .querySelector(
            "#room01-name"
        )
        .value
        .trim();



    const text =
        this.editorPanel
        .querySelector(
            "#room01-content"
        )
        .value
        .trim();



    const input =
        this.editorPanel
        .querySelector(
            "#room01-file"
        );



    const upload =
        input.files[0];



    let attachment =
        null;



    if(upload){


        attachment =
            await this.readFile(
                upload
            );


    }



    if(this.editingFileId){


        const target =
            this.savedFiles.find(
                item =>
                item.id ===
                this.editingFileId
            );



        if(target){


            target.name =
                name;


            target.text =
                text;



        }



    }
    else{


        this.savedFiles.unshift({


            id:
            Date.now(),



            name:
            name ||
            "未命名档案",



            text:
            text,



            attachment:
            attachment,



            attachmentName:
            upload?
            upload.name:
            "",



            attachmentType:
            upload?
            upload.type:
            "",



            createdAt:
            new Date()
            .toISOString()



        });



    }



    this.saveFiles();



    this.renderFileObjects();



    this.hideEditor();



}

// =========================================================
// READ FILE
// =========================================================


readFile(file){


    return new Promise(
        resolve=>{


            const reader =
                new FileReader();



            reader.onload =
            ()=>{


                resolve(
                    reader.result
                );


            };



            reader.readAsDataURL(
                file
            );


        }
    );


}



// =========================================================
// CREATE VIEWER
// =========================================================


createViewer(){



    this.viewerPanel =
        document.createElement(
            "div"
        );



    this.viewerPanel.style.cssText = `


        display:none;


        position:absolute;


        left:50%;


        top:50%;


        transform:
        translate(-50%,-50%);



        width:620px;



        max-width:90vw;



        padding:30px;



        background:#DCDADD;



        color:#ADADAD;



        border-radius:18px;



        pointer-events:auto;



        box-shadow:
        0 30px 80px rgba(0,0,0,.25);



    `;



    this.uiContainer.appendChild(
        this.viewerPanel
    );


}



// =========================================================
// OPEN FILE
// =========================================================


openFile(file){



    if(!file){

        return;

    }



    this.openedFileId =
        file.id;



    this.viewerPanel.innerHTML = `


        <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        ">


        <h2>

        ${this.escapeHTML(
            file.name
        )}

        </h2>



        <button id="room01-close">

        ×

        </button>



        </div>



        <div>

        创建日期：

        ${this.formatDate(
            file.createdAt
        )}

        </div>



        <hr>



        <div style="

        white-space:pre-wrap;

        line-height:1.8;

        ">


        ${
            this.escapeHTML(
                file.text ||
                "没有文字内容"
            )
        }


        </div>



        ${
            file.attachmentName

            ?

            `

            <p>

            📎
            ${file.attachmentName}

            </p>

            `

            :

            ""

        }



        <br>



        <button id="room01-edit">

        设置 / 编辑

        </button>



        <button id="room01-delete">

        删除档案

        </button>


    `;



    this.viewerPanel.style.display =
        "block";



    this.viewerPanel
    .querySelector(
        "#room01-close"
    )
    .onclick =
    ()=>{


        this.hideViewer();


    };



    this.viewerPanel
    .querySelector(
        "#room01-edit"
    )
    .onclick =
    ()=>{


        this.showEditor(
            file
        );


    };



    this.viewerPanel
    .querySelector(
        "#room01-delete"
    )
    .onclick =
    ()=>{


        this.deleteFile(
            file
        );


    };


}



// =========================================================
// DELETE
// =========================================================


deleteFile(file){



    if(
        !confirm(
        "确定删除这个档案吗？"
        )
    ){

        return;

    }



    this.savedFiles =
        this.savedFiles.filter(
            item =>
            item.id !== file.id
        );



    this.saveFiles();



    this.hideViewer();



    this.renderFileObjects();



}



// =========================================================
// HIDE VIEWER
// =========================================================


hideViewer(){



    if(this.viewerPanel){


        this.viewerPanel.style.display =
            "none";


    }


}



// =========================================================
// RENDER CARDS
// =========================================================


renderFileObjects(){



    this.fileGroup.clear();



    this.fileObjects =
        [];



    this.savedFiles.forEach(
        (file,index)=>{



            const card =
                this.createFileCard(
                    file
                );



            card.position.x =
                (
                    index % 5 - 2
                )
                *
                1.8;



            card.position.y =
                1.8 -
                Math.floor(
                    index / 5
                )
                *
                1.5;



            this.fileGroup.add(
                card
            );



            this.fileObjects.push(
                card
            );


        }
    );



}



// =========================================================
// CREATE CARD
// =========================================================


createFileCard(file){



    const group =
        new THREE.Group();



    group.name =
        "ROOM01_FILE_CARD";



    group.userData.file =
        file;



    group.userData.interactive =
        true;



    const click =
    ()=>{


        this.openFile(
            file
        );


    };



    group.userData.onClick =
        click;



    // =====================================================
    // CARD BODY
    // =====================================================


    const geometry =
        new THREE.PlaneGeometry(
            1.35,
            1
        );



    const material =
        new THREE.MeshBasicMaterial({

            color:
            this.colors.card,


            transparent:true,


            opacity:
            .95,


            side:
            THREE.DoubleSide


        });



    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );



    mesh.userData.file =
        file;


    mesh.userData.onClick =
        click;


    mesh.userData.interactive =
        true;



    group.add(
        mesh
    );



    // =====================================================
    // TITLE
    // =====================================================


    const title =
        this.createTextSprite(
            file.name,
            .12,
            this.colors.gray
        );



    title.position.y =
        .25;



    title.userData.onClick =
        click;



    group.add(
        title
    );



    return group;



}



// =========================================================
// TEXT SPRITE
// =========================================================


createTextSprite(
text,
size,
color
){



    const canvas =
        document.createElement(
            "canvas"
        );



    canvas.width =
        512;


    canvas.height =
        128;



    const ctx =
        canvas.getContext(
            "2d"
        );



    ctx.fillStyle =
        "#" +
        color
        .toString(16)
        .padStart(
            6,
            "0"
        );



    ctx.font =
        "40px Arial";



    ctx.textAlign =
        "center";



    ctx.textBaseline =
        "middle";



    ctx.fillText(
        text,
        256,
        64
    );



    const texture =
        new THREE.CanvasTexture(
            canvas
        );



    const material =
        new THREE.SpriteMaterial({

            map:
            texture,


            transparent:
            true


        });



    const sprite =
        new THREE.Sprite(
            material
        );



    sprite.scale.set(
        1.2,
        .3,
        1
    );



    return sprite;



}



// =========================================================
// FORMAT DATE
// =========================================================


formatDate(value){



    if(!value){

        return "";

    }



    return new Date(
        value
    )
    .toLocaleDateString(
        "zh-CN"
    );



}



// =========================================================
// ESCAPE
// =========================================================


escapeHTML(value){



    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    );


}



// =========================================================
// UI SHOW/HIDE
// =========================================================


showUI(){


    if(this.uiContainer){

        this.uiContainer.style.display =
            "block";

    }


}



hideUI(){


    if(this.uiContainer){

        this.uiContainer.style.display =
            "none";

    }


}



// =========================================================
// DISPOSE
// =========================================================


dispose(){



    this.active =
        false;



    this.hideUI();



    if(
        this.uiContainer &&
        this.uiContainer.parentNode
    ){


        this.uiContainer.parentNode
        .removeChild(
            this.uiContainer
        );


    }



    this.fileObjects =
        [];



    this.group.clear();



}


}