import * as THREE from "three";

export default class Interaction {

    constructor(
        camera,
        scene,
        domElement,
        eventBus = null
    ) {

        // =====================================================
        // CAMERA
        // =====================================================

        this.camera = camera;


        // =====================================================
        // MAIN SCENE
        // =====================================================

        this.scene = scene;


        // =====================================================
        // DOM / CANVAS
        // =====================================================

        this.domElement = domElement;


        // =====================================================
        // EVENT BUS
        // =====================================================

        this.eventBus = eventBus;


        // =====================================================
        // RAYCASTER
        // =====================================================

        this.raycaster =
            new THREE.Raycaster();

        this.pointer =
            new THREE.Vector2();


        // =====================================================
        // INTERACTABLE OBJECTS
        // =====================================================

        this.interactables = [];


        // =====================================================
        // ENABLE
        // =====================================================

        this.enabled = true;


        // =====================================================
        // POINTER EVENT
        // =====================================================

        this._onPointerDown =
            this.onPointerDown.bind(this);


        if (
            this.domElement &&
            typeof this.domElement.addEventListener ===
            "function"
        ) {

            this.domElement.addEventListener(
                "pointerdown",
                this._onPointerDown
            );

        }

    }


    // =====================================================
    // ADD
    // =====================================================

    add(
        object,
        callback = null
    ) {

        if (!object) {
            return;
        }


        // -----------------------------------------------------
        // 避免重复注册
        // -----------------------------------------------------

        const existing =
            this.interactables.find(
                item =>
                    item.object === object
            );


        if (existing) {

            if (
                typeof callback ===
                "function"
            ) {

                existing.callback =
                    callback;

            }

            return object;
        }


        // -----------------------------------------------------
        // 支持对象形式
        //
        // {
        //     object,
        //     callback
        // }
        // -----------------------------------------------------

        if (
            typeof object === "object" &&
            object.object &&
            !object.isObject3D
        ) {

            const target =
                object.object;


            const objectCallback =
                object.callback ||
                object.onClick ||
                null;


            this.interactables.push({

                object:
                    target,

                callback:
                    typeof objectCallback ===
                    "function"
                        ? objectCallback
                        : null

            });


            return target;
        }


        // -----------------------------------------------------
        // 普通 THREE.Object3D
        // -----------------------------------------------------

        let finalCallback =
            typeof callback === "function"
                ? callback
                : null;


        // -----------------------------------------------------
        // 如果对象自己有 userData.onClick
        // -----------------------------------------------------

        if (
            !finalCallback &&
            object.userData &&
            typeof object.userData.onClick ===
            "function"
        ) {

            finalCallback =
                object.userData.onClick;

        }


        // -----------------------------------------------------
        // callback
        // -----------------------------------------------------

        if (
            !finalCallback &&
            object.userData &&
            typeof object.userData.callback ===
            "function"
        ) {

            finalCallback =
                object.userData.callback;

        }


        this.interactables.push({

            object,

            callback:
                finalCallback

        });


        return object;

    }


    // =====================================================
    // REGISTER
    // =====================================================

    register(
        object,
        callback = null
    ) {

        return this.add(
            object,
            callback
        );

    }


    // =====================================================
    // ADD MULTIPLE
    // =====================================================

    addMultiple(
        objects,
        callback = null
    ) {

        if (
            !Array.isArray(objects)
        ) {

            return;

        }


        objects.forEach(
            object => {

                this.add(
                    object,
                    callback
                );

            }
        );

    }


    // =====================================================
    // REGISTER MULTIPLE
    // =====================================================

    registerMultiple(
        objects,
        callback = null
    ) {

        return this.addMultiple(
            objects,
            callback
        );

    }


    // =====================================================
    // REMOVE
    // =====================================================

    remove(object) {

        this.interactables =
            this.interactables.filter(
                item =>
                    item.object !== object
            );

    }


    // =====================================================
    // UNREGISTER
    // =====================================================

    unregister(object) {

        this.remove(object);

    }


    // =====================================================
    // CLEAR
    // =====================================================

    clear() {

        this.interactables = [];

    }


    // =====================================================
    // ENABLE
    // =====================================================

    enable() {

        this.enabled = true;

    }


    // =====================================================
    // DISABLE
    // =====================================================

    disable() {

        this.enabled = false;

    }


    // =====================================================
    // POINTER DOWN
    // =====================================================

    onPointerDown(event) {

        if (!this.enabled) {
            return;
        }


        if (!this.camera) {
            return;
        }


        if (!this.domElement) {
            return;
        }


        // =================================================
        // CANVAS RECT
        // =================================================

        const rect =
            this.domElement.getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {

            return;

        }


        // =================================================
        // POINTER COORDINATES
        // =================================================

        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1;


        this.pointer.y =
            -(
                (
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) * 2 - 1
            );


        // =================================================
        // RAYCAST
        // =================================================

        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        // =================================================
        // REGISTERED OBJECTS
        // =================================================

        const objects =
            this.interactables
                .map(
                    item =>
                        item.object
                )
                .filter(Boolean);


        if (
            objects.length === 0
        ) {

            return;

        }


        // =================================================
        // INTERSECTIONS
        //
        // true = 检查所有子级
        // =================================================

        const intersects =
            this.raycaster.intersectObjects(
                objects,
                true
            );


        if (
            intersects.length === 0
        ) {

            return;

        }


        // =================================================
        // 最近命中的对象
        // =================================================

        const hit =
            intersects[0];


        // =================================================
        // 找到注册的父对象
        // =================================================

        const target =
            this.findRegisteredObject(
                hit.object
            );


        if (!target) {

            return;

        }


        // =================================================
        // 找到 Interaction
        // =================================================

        const interaction =
            this.interactables.find(
                item =>
                    item.object === target
            );


        if (!interaction) {

            return;

        }


        // =================================================
        // ① 优先使用注册对象 callback
        // =================================================

        if (
            typeof interaction.callback ===
            "function"
        ) {

            interaction.callback(
                target,
                hit,
                event
            );

        }


        // =================================================
        // ② 如果注册对象没有 callback
        //
        // 检查真正被点击的对象
        //
        // Polaris 的 hitArea 就属于这一种。
        //
        // hit.object
        //      ↓
        // hitArea
        //      ↓
        // userData.onClick
        //
        // =================================================

        else {

            const clickedObject =
                hit.object;


            if (
                clickedObject &&
                clickedObject.userData &&
                typeof clickedObject.userData.onClick ===
                "function"
            ) {

                clickedObject.userData.onClick(
                    target,
                    hit,
                    event
                );

            }


            // -------------------------------------------------
            // 如果没有 onClick，再检查 callback
            // -------------------------------------------------

            else if (
                clickedObject &&
                clickedObject.userData &&
                typeof clickedObject.userData.callback ===
                "function"
            ) {

                clickedObject.userData.callback(
                    target,
                    hit,
                    event
                );

            }

        }


        // =================================================
        // EVENT BUS
        // =================================================

        if (
            this.eventBus &&
            typeof this.eventBus.emit ===
            "function"
        ) {

            this.eventBus.emit(
                "interaction",
                {

                    target,

                    intersection:
                        hit,

                    event

                }
            );

        }

    }


    // =====================================================
    // FIND REGISTERED OBJECT
    // =====================================================

    findRegisteredObject(object) {

        let current =
            object;


        while (current) {

            const registered =
                this.interactables.find(
                    item =>
                        item.object ===
                        current
                );


            if (registered) {

                return current;

            }


            current =
                current.parent;

        }


        return null;

    }


    // =====================================================
    // MANUAL TRIGGER
    // =====================================================

    trigger(
        object,
        event = null
    ) {

        const interaction =
            this.interactables.find(
                item =>
                    item.object === object
            );


        if (!interaction) {

            return;

        }


        if (
            typeof interaction.callback ===
            "function"
        ) {

            interaction.callback(
                object,
                null,
                event
            );

        }


        else if (
            object &&
            object.userData &&
            typeof object.userData.onClick ===
            "function"
        ) {

            object.userData.onClick(
                object,
                null,
                event
            );

        }

    }


    // =====================================================
    // GET ALL
    // =====================================================

    getAll() {

        return this.interactables;

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update() {

        // 不需要每帧更新

    }


    // =====================================================
    // DESTROY
    // =====================================================

    destroy() {

        if (
            this.domElement &&
            this._onPointerDown &&
            typeof this.domElement.removeEventListener ===
            "function"
        ) {

            this.domElement.removeEventListener(
                "pointerdown",
                this._onPointerDown
            );

        }


        this.interactables = [];

        this.camera = null;

        this.scene = null;

        this.domElement = null;

        this.eventBus = null;

    }

}