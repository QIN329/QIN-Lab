import * as THREE from "three";

export default class SceneManager {

    constructor(mainScene) {

        // =====================================================
        // MAIN SCENE
        // =====================================================

        this.scene = mainScene;

        this.scenes = {};

        this.current = null;
        this.currentScene = null;
        this.currentSceneName = null;

        this.visible = true;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    register(name, scene) {

        if (!name || !scene) {
            return;
        }

        this.scenes[name] = scene;

        return scene;
    }


    // =====================================================
    // ADD
    // =====================================================

    add(name, scene) {

        return this.register(name, scene);
    }


    // =====================================================
    // SHOW
    //
    // App.js 使用：
    //
    // this.sceneManager.show("landing")
    //
    // =====================================================

    show(name) {

        const nextScene = this.scenes[name];

        if (!nextScene) {

            console.warn(
                `SceneManager: scene "${name}" not found.`
            );

            return false;
        }


        // -----------------------------------------------------
        // 隐藏旧场景
        // -----------------------------------------------------

        if (this.currentScene) {

            this.removeSceneFromMainScene(
                this.currentScene
            );

            if (
                typeof this.currentScene.hide ===
                "function"
            ) {

                this.currentScene.hide();

            }
        }


        // -----------------------------------------------------
        // 当前场景
        // -----------------------------------------------------

        this.current = nextScene;

        this.currentScene = nextScene;

        this.currentSceneName = name;


        // -----------------------------------------------------
        // 将新的 Scene / Group 放入主 Scene
        // -----------------------------------------------------

        this.addSceneToMainScene(
            nextScene
        );


        // -----------------------------------------------------
        // 显示
        // -----------------------------------------------------

        if (
            typeof nextScene.show ===
            "function"
        ) {

            nextScene.show();

        }
        else {

            const object =
                this.getSceneObject(nextScene);

            if (object) {
                object.visible = true;
            }
        }


        // -----------------------------------------------------
        // enter
        // -----------------------------------------------------

        if (
            typeof nextScene.enter ===
            "function"
        ) {

            nextScene.enter();

        }


        return true;
    }


    // =====================================================
    // SWITCH TO
    // =====================================================

    switchTo(name) {

        return this.show(name);
    }


    // =====================================================
    // SET SCENE
    // =====================================================

    setScene(name) {

        return this.show(name);
    }


    // =====================================================
    // ADD SCENE OBJECT TO MAIN SCENE
    // =====================================================

    addSceneToMainScene(sceneInstance) {

        if (!this.scene) {
            return;
        }

        const object =
            this.getSceneObject(sceneInstance);

        if (!object) {
            return;
        }


        // 已经在主 Scene 中
        if (object.parent === this.scene) {
            object.visible = true;
            return;
        }


        this.scene.add(object);

        object.visible = true;
    }


    // =====================================================
    // REMOVE SCENE OBJECT
    // =====================================================

    removeSceneFromMainScene(sceneInstance) {

        if (!this.scene) {
            return;
        }

        const object =
            this.getSceneObject(sceneInstance);

        if (!object) {
            return;
        }


        if (object.parent === this.scene) {

            this.scene.remove(object);

        }
    }


    // =====================================================
    // GET SCENE OBJECT
    //
    // 兼容：
    //
    // scene.scene
    // scene.group
    // scene.object
    // scene 本身
    //
    // =====================================================

    getSceneObject(sceneInstance) {

        if (!sceneInstance) {
            return null;
        }


        // Scene / Group / Object3D
        if (
            sceneInstance.isObject3D
        ) {

            return sceneInstance;

        }


        // scene.scene
        if (
            sceneInstance.scene &&
            sceneInstance.scene.isObject3D
        ) {

            return sceneInstance.scene;

        }


        // scene.group
        if (
            sceneInstance.group &&
            sceneInstance.group.isObject3D
        ) {

            return sceneInstance.group;

        }


        // scene.object
        if (
            sceneInstance.object &&
            sceneInstance.object.isObject3D
        ) {

            return sceneInstance.object;

        }


        return null;
    }


    // =====================================================
    // HIDE
    // =====================================================

    hide(name = null) {

        const target =
            name
                ? this.scenes[name]
                : this.currentScene;

        if (!target) {
            return;
        }


        if (
            typeof target.hide ===
            "function"
        ) {

            target.hide();

            return;
        }


        const object =
            this.getSceneObject(target);

        if (object) {
            object.visible = false;
        }
    }


    // =====================================================
    // GET
    // =====================================================

    get(name) {

        return this.scenes[name];

    }


    // =====================================================
    // CURRENT SCENE
    // =====================================================

    getCurrentScene() {

        return this.currentScene;

    }


    // =====================================================
    // CURRENT NAME
    // =====================================================

    getCurrentSceneName() {

        return this.currentSceneName;

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update(delta) {

        if (!this.visible) {
            return;
        }


        if (!this.currentScene) {
            return;
        }


        if (
            typeof this.currentScene.update ===
            "function"
        ) {

            this.currentScene.update(delta);

        }
    }


    // =====================================================
    // REMOVE
    // =====================================================

    remove(name) {

        const scene =
            this.scenes[name];

        if (!scene) {
            return;
        }


        this.removeSceneFromMainScene(
            scene
        );


        if (
            typeof scene.destroy ===
            "function"
        ) {

            scene.destroy();

        }


        delete this.scenes[name];


        if (
            this.currentSceneName ===
            name
        ) {

            this.currentScene = null;

            this.current = null;

            this.currentSceneName = null;
        }
    }


    // =====================================================
    // CLEAR
    // =====================================================

    clear() {

        Object.keys(
            this.scenes
        ).forEach(name => {

            this.removeSceneFromMainScene(
                this.scenes[name]
            );

        });


        this.scenes = {};

        this.current = null;

        this.currentScene = null;

        this.currentSceneName = null;
    }


    // =====================================================
    // DESTROY
    // =====================================================

    destroy() {

        Object.keys(
            this.scenes
        ).forEach(name => {

            const scene =
                this.scenes[name];

            this.removeSceneFromMainScene(
                scene
            );

            if (
                scene &&
                typeof scene.destroy ===
                "function"
            ) {

                scene.destroy();

            }

        });


        this.scenes = {};

        this.current = null;

        this.currentScene = null;

        this.currentSceneName = null;
    }
}