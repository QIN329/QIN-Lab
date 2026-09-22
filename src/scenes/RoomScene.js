import * as THREE from "three";

export default class RoomScene {
    constructor(app) {
        this.app = app;

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0xd7bfa2);

        this.camera = app?.perspectiveCamera || null;

        this.objects = [];
        this.currentRoom = null;

        this.group = new THREE.Group();

        this.scene.add(this.group);

        this.createRoom();
    }

    /**
     * 创建 Room 基础环境
     */
    createRoom() {
        // =====================================================
        // 地面
        // =====================================================

        const floorGeometry = new THREE.PlaneGeometry(
            30,
            30
        );

        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xc8b18d,
            roughness: 0.9
        });

        const floor = new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2;

        this.group.add(floor);

        this.objects.push(floor);

        // =====================================================
        // 背景墙
        // =====================================================

        const wallGeometry = new THREE.PlaneGeometry(
            30,
            18
        );

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xd7bfa2,
            roughness: 1
        });

        const wall = new THREE.Mesh(
            wallGeometry,
            wallMaterial
        );

        wall.position.set(
            0,
            7,
            -8
        );

        this.group.add(wall);

        this.objects.push(wall);

        // =====================================================
        // 柔和环境光
        // =====================================================

        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            1.8
        );

        this.group.add(ambientLight);

        // =====================================================
        // 主光
        // =====================================================

        const directionalLight =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );

        directionalLight.position.set(
            4,
            10,
            6
        );

        this.group.add(directionalLight);
    }

    /**
     * 打开房间
     *
     * roomId:
     * room01
     * room02
     * ...
     */
    open(roomId = "room01") {
        this.currentRoom = roomId;

        this.clearRoomObjects();

        switch (roomId) {
            case "room01":
                this.openRoom01();
                break;

            case "room02":
                this.openRoom02();
                break;

            case "room03":
                this.openRoom03();
                break;

            case "room04":
                this.openRoom04();
                break;

            case "room05":
                this.openRoom05();
                break;

            case "room06":
                this.openRoom06();
                break;

            case "room07":
                this.openRoom07();
                break;

            default:
                this.openRoom01();
                break;
        }

        return this;
    }

    /**
     * 清除上一间房间的物体
     */
    clearRoomObjects() {
        const keep = [];

        this.group.children.forEach(child => {
            if (
                child === this.group.children[0] ||
                child === this.group.children[1]
            ) {
                keep.push(child);
            }
        });

        // 不真正删除基础环境，只清理标记为 roomObject 的对象
        const removeList = [];

        this.group.children.forEach(child => {
            if (child.userData?.roomObject) {
                removeList.push(child);
            }
        });

        removeList.forEach(child => {
            this.group.remove(child);

            if (child.geometry) {
                child.geometry.dispose();
            }

            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(
                        material => material.dispose()
                    );
                } else {
                    child.material.dispose();
                }
            }
        });

        this.objects = this.objects.filter(
            object => !object.userData?.roomObject
        );
    }

    /**
     * Room 01
     * Archive
     */
    openRoom01() {
        const table = this.createBox(
            7,
            0.7,
            3.5,
            0xb49a76
        );

        table.position.set(
            0,
            -1.1,
            -1
        );

        this.addRoomObject(table);

        // 文件卡片
        for (let i = 0; i < 4; i++) {
            const card = this.createBox(
                2.5,
                0.08,
                1.5,
                0xf1eadc
            );

            card.position.set(
                -3.2 + i * 2.1,
                -0.7,
                -1
            );

            card.rotation.y =
                (i - 1.5) * 0.05;

            card.userData.type = "archive-card";
            card.userData.fileIndex = i;

            this.addRoomObject(card);
        }
    }

    /**
     * Room 02
     */
    openRoom02() {
        const object = this.createBox(
            4,
            3,
            2,
            0xc9b79c
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * Room 03
     */
    openRoom03() {
        const object = this.createBox(
            3,
            3,
            3,
            0xbfa98b
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * Room 04
     */
    openRoom04() {
        const object = this.createBox(
            5,
            2,
            2,
            0xd0bda0
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * Room 05
     */
    openRoom05() {
        const object = this.createBox(
            2,
            2,
            2,
            0xc1aa8b
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * Room 06
     */
    openRoom06() {
        const object = this.createBox(
            4,
            2.5,
            2,
            0xc8b18d
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * Room 07
     */
    openRoom07() {
        const object = this.createBox(
            3,
            2,
            3,
            0xbda487
        );

        object.position.set(
            0,
            0,
            -1
        );

        this.addRoomObject(object);
    }

    /**
     * 创建方块
     */
    createBox(
        width,
        height,
        depth,
        color
    ) {
        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.85
            });

        return new THREE.Mesh(
            geometry,
            material
        );
    }

    /**
     * 添加房间对象
     */
    addRoomObject(object) {
        object.userData.roomObject = true;

        this.group.add(object);

        this.objects.push(object);

        return object;
    }

    /**
     * 更新
     */
    update(delta = 0) {
        // Room 场景目前保持静止
        // 后续可以在这里加入动画
    }

    /**
     * 显示
     */
    show() {
        this.group.visible = true;
    }

    /**
     * 隐藏
     */
    hide() {
        this.group.visible = false;
    }

    /**
     * 销毁
     */
    destroy() {
        this.group.traverse(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(
                        material => material.dispose()
                    );
                } else {
                    object.material.dispose();
                }
            }
        });

        this.scene.clear();
    }
}