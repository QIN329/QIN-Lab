import * as THREE from "three";


export default class ColorController {

    constructor({
        scene,
        spaceBackground,
        nebula
    } = {}) {

        this.scene =
            scene || null;

        this.spaceBackground =
            spaceBackground || null;

        this.nebula =
            nebula || null;


        // =====================================================
        // DEFAULT PALETTE
        // =====================================================

        this.defaultPalette = {

            top:
                "#02030a",

            middle:
                "#102f52",

            bottom:
                "#07152d",

            atmosphere:
                "#173b68",

            nebulaA:
                "#173b68",

            nebulaB:
                "#244f82",

            nebulaC:
                "#5f5b91",

            nebulaD:
                "#13253f"

        };


        // =====================================================
        // LOAD SAVED PALETTE
        // =====================================================

        this.palette =
            this.loadPalette();


        // =====================================================
        // DOM
        // =====================================================

        this.button =
            null;

        this.panel =
            null;

        this.inputs =
            {};

        this.isOpen =
            false;


        // =====================================================
        // MOUSE
        // =====================================================

        this.mouseX =
            window.innerWidth;

        this.mouseY =
            0;

        this.glow =
            0;

        this.targetGlow =
            0;


        // =====================================================
        // CREATE
        // =====================================================

        this.create();

        this.apply();

    }



    // =========================================================
    // LOAD PALETTE
    // =========================================================

    loadPalette() {

        try {

            const saved =
                localStorage.getItem(
                    "qin_lab_universe_palette"
                );


            if (
                saved
            ) {

                const parsed =
                    JSON.parse(
                        saved
                    );


                return {
                    ...this.defaultPalette,
                    ...parsed
                };

            }

        }

        catch (
            error
        ) {

            console.warn(
                "QIN Lab palette load failed.",
                error
            );

        }


        return {
            ...this.defaultPalette
        };

    }



    // =========================================================
    // SAVE
    // =========================================================

    savePalette() {

        try {

            localStorage.setItem(
                "qin_lab_universe_palette",
                JSON.stringify(
                    this.palette
                )
            );

        }

        catch (
            error
        ) {

            console.warn(
                "QIN Lab palette save failed.",
                error
            );

        }

    }



    // =========================================================
    // CREATE
    // =========================================================

    create() {

        // -----------------------------------------------------
        // 清除旧版本
        // -----------------------------------------------------

        document
            .querySelectorAll(
                "[data-qin-color-controller]"
            )
            .forEach(
                element => element.remove()
            );


        // =====================================================
        // HIDDEN TRIGGER
        // =====================================================

        this.button =
            document.createElement(
                "button"
            );


        this.button.type =
            "button";


        this.button.setAttribute(
            "aria-label",
            "Universe color settings"
        );


        this.button.dataset.qinColorController =
            "trigger";


        Object.assign(
            this.button.style,
            {

                position:
                    "fixed",

                top:
                    "0px",

                right:
                    "0px",

                width:
                    "110px",

                height:
                    "110px",

                padding:
                    "0",

                margin:
                    "0",

                border:
                    "0",

                background:
                    "transparent",

                cursor:
                    "default",

                zIndex:
                    "99999",

                outline:
                    "none",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                opacity:
                    "0.02",

                transition:
                    "opacity 0.35s ease"

            }
        );


        // =====================================================
        // LIGHT DOT
        // =====================================================

        this.dot =
            document.createElement(
                "span"
            );


        Object.assign(
            this.dot.style,
            {

                width:
                    "4px",

                height:
                    "4px",

                borderRadius:
                    "50%",

                background:
                    "rgba(220,235,255,0.9)",

                boxShadow:
                    "0 0 0 rgba(180,220,255,0)",

                transform:
                    "scale(0.75)",

                transition:
                    "transform 0.25s ease, box-shadow 0.25s ease"

            }
        );


        this.button.appendChild(
            this.dot
        );


        document.body.appendChild(
            this.button
        );


        // =====================================================
        // PANEL
        // =====================================================

        this.createPanel();


        // =====================================================
        // EVENTS
        // =====================================================

        window.addEventListener(
            "mousemove",
            this.handleMouseMove
        );


        this.button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                this.toggle();

            }
        );


        this.button.addEventListener(
            "mouseenter",
            () => {

                this.targetGlow =
                    1;

            }
        );


        this.panel.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    this.isOpen &&
                    !this.panel.contains(
                        event.target
                    ) &&
                    event.target !== this.button
                ) {

                    this.close();

                }

            }
        );

    }



    // =========================================================
    // PANEL
    // =========================================================

    createPanel() {

        this.panel =
            document.createElement(
                "div"
            );


        this.panel.dataset.qinColorController =
            "panel";


        Object.assign(
            this.panel.style,
            {

                position:
                    "fixed",

                top:
                    "28px",

                right:
                    "28px",

                width:
                    "245px",

                padding:
                    "18px 18px 16px",

                boxSizing:
                    "border-box",

                border:
                    "1px solid rgba(210,230,255,0.18)",

                borderRadius:
                    "14px",

                background:
                    "rgba(4,8,18,0.78)",

                backdropFilter:
                    "blur(18px)",

                WebkitBackdropFilter:
                    "blur(18px)",

                boxShadow:
                    "0 12px 45px rgba(0,0,0,0.35)",

                color:
                    "#ffffff",

                fontFamily:
                    "Arial, Helvetica, sans-serif",

                fontSize:
                    "12px",

                letterSpacing:
                    "0.04em",

                opacity:
                    "0",

                pointerEvents:
                    "none",

                transform:
                    "translateY(-8px) scale(0.97)",

                transformOrigin:
                    "top right",

                transition:
                    "opacity 0.25s ease, transform 0.25s ease",

                zIndex:
                    "100000"

            }
        );


        // =====================================================
        // TITLE
        // =====================================================

        const title =
            document.createElement(
                "div"
            );


        title.textContent =
            "UNIVERSE";


        Object.assign(
            title.style,
            {

                fontSize:
                    "10px",

                letterSpacing:
                    "0.22em",

                opacity:
                    "0.55",

                marginBottom:
                    "15px"

            }
        );


        this.panel.appendChild(
            title
        );


        // =====================================================
        // COLORS
        // =====================================================

        this.addColorInput(
            "Background",
            "middle"
        );

        this.addColorInput(
            "Nebula A",
            "nebulaA"
        );

        this.addColorInput(
            "Nebula B",
            "nebulaB"
        );

        this.addColorInput(
            "Nebula C",
            "nebulaC"
        );

        this.addColorInput(
            "Nebula D",
            "nebulaD"
        );

        this.addColorInput(
            "Atmosphere",
            "atmosphere"
        );


        // =====================================================
        // RESET
        // =====================================================

        const reset =
            document.createElement(
                "button"
            );


        reset.type =
            "button";


        reset.textContent =
            "RESET";


        Object.assign(
            reset.style,
            {

                marginTop:
                    "12px",

                padding:
                    "7px 10px",

                border:
                    "1px solid rgba(255,255,255,0.12)",

                borderRadius:
                    "7px",

                background:
                    "rgba(255,255,255,0.04)",

                color:
                    "rgba(255,255,255,0.65)",

                cursor:
                    "pointer",

                fontSize:
                    "9px",

                letterSpacing:
                    "0.14em"

            }
        );


        reset.addEventListener(
            "click",
            () => {

                this.palette =
                    {
                        ...this.defaultPalette
                    };


                this.updateInputs();

                this.apply();

                this.savePalette();

            }
        );


        this.panel.appendChild(
            reset
        );


        document.body.appendChild(
            this.panel
        );

    }



    // =========================================================
    // ADD COLOR INPUT
    // =========================================================

    addColorInput(
        labelText,
        key
    ) {

        const row =
            document.createElement(
                "div"
            );


        Object.assign(
            row.style,
            {

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "space-between",

                marginBottom:
                    "10px"

            }
        );


        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            labelText;


        label.style.opacity =
            "0.62";


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "color";


        input.value =
            this.palette[key];


        Object.assign(
            input.style,
            {

                width:
                    "30px",

                height:
                    "22px",

                padding:
                    "0",

                border:
                    "1px solid rgba(255,255,255,0.15)",

                borderRadius:
                    "5px",

                background:
                    "transparent",

                cursor:
                    "pointer"

            }
        );


        input.addEventListener(
            "input",
            () => {

                this.palette[key] =
                    input.value;


                this.apply();

                this.savePalette();

            }
        );


        row.appendChild(
            label
        );

        row.appendChild(
            input
        );


        this.panel.appendChild(
            row
        );


        this.inputs[key] =
            input;

    }



    // =========================================================
    // UPDATE INPUTS
    // =========================================================

    updateInputs() {

        Object.keys(
            this.inputs
        ).forEach(
            key => {

                if (
                    this.inputs[key] &&
                    this.palette[key]
                ) {

                    this.inputs[key].value =
                        this.palette[key];

                }

            }
        );

    }



    // =========================================================
    // APPLY
    // =========================================================

    apply() {

        // =====================================================
        // SPACE BACKGROUND
        // =====================================================

        if (
            this.spaceBackground &&
            typeof this.spaceBackground.setPalette ===
            "function"
        ) {

            this.spaceBackground.setPalette({

                middle:
                    new THREE.Color(
                        this.palette.middle
                    ).getHex(),

                atmosphere:
                    new THREE.Color(
                        this.palette.atmosphere
                    ).getHex()

            });

        }


        // =====================================================
        // NEBULA
        // =====================================================

        if (
            this.nebula &&
            typeof this.nebula.setColors ===
            "function"
        ) {

            this.nebula.setColors({

                colorA:
                    this.palette.nebulaA,

                colorB:
                    this.palette.nebulaB,

                colorC:
                    this.palette.nebulaC,

                colorD:
                    this.palette.nebulaD

            });

        }

    }



    // =========================================================
    // MOUSE MOVE
    // =========================================================

    handleMouseMove =
        (event) => {

            this.mouseX =
                event.clientX;

            this.mouseY =
                event.clientY;


            const distanceFromCorner =
                Math.sqrt(
                    Math.pow(
                        window.innerWidth -
                        event.clientX,
                        2
                    ) +
                    Math.pow(
                        event.clientY,
                        2
                    )
                );


            const radius =
                135;


            if (
                distanceFromCorner <
                radius
            ) {

                const strength =
                    1 -
                    distanceFromCorner /
                    radius;


                this.targetGlow =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            strength
                        )
                    );

            }

            else {

                this.targetGlow =
                    0;

            }


            this.updateGlow();

        };



    // =========================================================
    // UPDATE GLOW
    // =========================================================

    updateGlow() {

        this.glow +=
            (
                this.targetGlow -
                this.glow
            ) *
            0.12;


        if (
            !this.button ||
            !this.dot
        ) {

            return;

        }


        // -----------------------------------------------------
        // 基础隐身
        // -----------------------------------------------------

        const opacity =
            0.02 +
            this.glow *
            0.58;


        this.button.style.opacity =
            opacity.toString();


        const scale =
            0.75 +
            this.glow *
            0.65;


        this.dot.style.transform =
            `scale(${scale})`;


        const glowSize =
            3 +
            this.glow *
            15;


        const glowAlpha =
            0.15 +
            this.glow *
            0.55;


        this.dot.style.boxShadow =
            `0 0 ${glowSize}px rgba(180,220,255,${glowAlpha})`;

    }



    // =========================================================
    // TOGGLE
    // =========================================================

    toggle() {

        if (
            this.isOpen
        ) {

            this.close();

        }

        else {

            this.open();

        }

    }



    // =========================================================
    // OPEN
    // =========================================================

    open() {

        this.isOpen =
            true;


        this.panel.style.opacity =
            "1";


        this.panel.style.pointerEvents =
            "auto";


        this.panel.style.transform =
            "translateY(0) scale(1)";


        this.targetGlow =
            1;

    }



    // =========================================================
    // CLOSE
    // =========================================================

    close() {

        this.isOpen =
            false;


        this.panel.style.opacity =
            "0";


        this.panel.style.pointerEvents =
            "none";


        this.panel.style.transform =
            "translateY(-8px) scale(0.97)";

    }



    // =========================================================
    // SHOW
    // =========================================================

    show() {

        if (
            this.button
        ) {

            this.button.style.display =
                "flex";

        }

    }



    // =========================================================
    // HIDE
    // =========================================================

    hide() {

        this.close();


        if (
            this.button
        ) {

            this.button.style.display =
                "none";

        }

    }



    // =========================================================
    // UPDATE
    // =========================================================

    update() {

        this.updateGlow();

    }



    // =========================================================
    // DISPOSE
    // =========================================================

    dispose() {

        window.removeEventListener(
            "mousemove",
            this.handleMouseMove
        );


        if (
            this.button
        ) {

            this.button.remove();

        }


        if (
            this.panel
        ) {

            this.panel.remove();

        }


        this.button =
            null;

        this.panel =
            null;

        this.inputs =
            {};

    }

}