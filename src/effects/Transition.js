import { gsap } from "gsap";

export default class Transition {
    constructor(app) {
        this.app = app;

        this.active = false;
        this.progress = 0;

        this.overlay = null;

        this.createOverlay();
    }

    /**
     * 创建转场遮罩
     */
    createOverlay() {
        this.overlay = document.createElement("div");

        this.overlay.id = "transition-overlay";

        Object.assign(this.overlay.style, {
            position: "fixed",
            inset: "0",
            zIndex: "9999",
            pointerEvents: "none",
            background: "#050816",
            opacity: "0",
            visibility: "hidden"
        });

        document.body.appendChild(this.overlay);
    }

    /**
     * 淡入
     */
    fadeIn(duration = 0.8) {
        if (!this.overlay) {
            return Promise.resolve();
        }

        this.active = true;

        this.overlay.style.visibility = "visible";
        this.overlay.style.pointerEvents = "auto";

        return new Promise(resolve => {
            gsap.to(this.overlay, {
                opacity: 1,
                duration,
                ease: "power2.inOut",
                onComplete: () => {
                    this.progress = 1;
                    resolve();
                }
            });
        });
    }

    /**
     * 淡出
     */
    fadeOut(duration = 0.8) {
        if (!this.overlay) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            gsap.to(this.overlay, {
                opacity: 0,
                duration,
                ease: "power2.inOut",
                onComplete: () => {
                    this.progress = 0;

                    this.overlay.style.visibility = "hidden";
                    this.overlay.style.pointerEvents = "none";

                    this.active = false;

                    resolve();
                }
            });
        });
    }

    /**
     * 执行完整转场
     *
     * callback 会在画面完全变黑后执行
     */
    async run(callback, duration = 0.8) {
        await this.fadeIn(duration);

        if (typeof callback === "function") {
            await callback();
        }

        await this.fadeOut(duration);
    }

    /**
     * 切换场景
     */
    async switchScene(sceneName, duration = 0.8) {
        await this.fadeIn(duration);

        if (
            this.app &&
            this.app.sceneManager &&
            typeof this.app.sceneManager.switchTo === "function"
        ) {
            this.app.sceneManager.switchTo(sceneName);
        }

        await this.fadeOut(duration);
    }

    /**
     * 显示遮罩
     */
    show() {
        if (!this.overlay) {
            return;
        }

        this.overlay.style.visibility = "visible";
        this.overlay.style.pointerEvents = "auto";

        gsap.set(this.overlay, {
            opacity: 1
        });

        this.active = true;
        this.progress = 1;
    }

    /**
     * 隐藏遮罩
     */
    hide() {
        if (!this.overlay) {
            return;
        }

        gsap.set(this.overlay, {
            opacity: 0
        });

        this.overlay.style.visibility = "hidden";
        this.overlay.style.pointerEvents = "none";

        this.active = false;
        this.progress = 0;
    }

    /**
     * 更新
     */
    update(delta = 0) {
        // 目前转场由 GSAP 控制
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.overlay) {
            gsap.killTweensOf(this.overlay);

            this.overlay.remove();

            this.overlay = null;
        }

        this.active = false;
        this.progress = 0;
    }
}