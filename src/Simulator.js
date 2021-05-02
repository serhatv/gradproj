// DataVisual: documentation: https://github.com/mariodelgadosr/dataVisual

import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Color,
    GridHelper,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    EdgesHelper,
    EdgesGeometry,
    LineSegments,
    LineBasicMaterial,
    Object3D,
    Font,
    TextGeometry,
    FontLoader,
    Group,
    Raycaster,
    Vector2,
} from "three";
// import * as d3 from "d3";
import { OrbitControls } from "./OrbitControls.js";

const helvetikerFont = require('./assets/helvetiker.json')
const util = require("./util");




class Simulator {
    constructor({ containerId, data, div }) {
        this.container = document.getElementById(containerId);
        this.renderer = new WebGLRenderer();

        this.scene = new Scene();
        this.div = div;
        this.camera = null;
        this.controls = null;
        this.data = data;
        this.size = div;
        this.blockSize = this.size / this.div;

        this.font = null;
    }


    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        const bgcolor = new Color(0xefefef);
        this.scene.background = bgcolor;

        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 32, 20);

        const gridHelper = new GridHelper(this.size, this.div);
        // this.scene.add(gridHelper);

        this.createTooltip();
        this.createActionbar();

        this.isActionActive = false;

        this.initBoxes();

        this.createCorridorTexts();

        this.animate();
    }

    createCorridorTexts() {
        const corridorNames = util.corridorNames(this.data);
        console.log(corridorNames);
        const font = new Font(helvetikerFont);

        const material = new MeshBasicMaterial({
            color: new Color('rgb(0, 0, 0)'),
            opacity: 0.4,
        });

        for (let index = 0; index < corridorNames.length; index++) {
            const name = corridorNames[index];
            const geometry = new TextGeometry(name, {
                font: font,
                size: 1,
                height: 0.05,
            });

            geometry.computeBoundingBox();

            const textMesh = new Mesh(geometry, material);
            textMesh.position.x = index * 4 + 3 * this.blockSize / 2 - this.div / 2;
            textMesh.position.y = 0.1;
            textMesh.position.z = this.size / 12;

            textMesh.rotation.x = -Math.PI / 2;

            this.scene.add(textMesh)
        }
    }

    initBoxes() {
        this.boxGroup = new Group();
        this.boxGroup.type = "box";
        // console.log(this.data);
        for (const item of this.data) {
            this.addToScene(this.boxGroup, item);
        }

        this.scene.add(this.boxGroup);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.render();
    }

    createActionbar() {
        const add = document.createElement("p");
        add.classList.add("add");
        add.textContent = "Add";

        const remove = document.createElement("remove");
        remove.classList.add("remove");
        remove.textContent = "Remove";

        const actionbar = document.createElement("div");
        actionbar.id = "Actionbar";
        actionbar.appendChild(add);
        actionbar.appendChild(remove);

        this.container.appendChild(actionbar);

        actionbar.style.position = "absolute";
        actionbar.style.top = `${-999}px`;
        actionbar.style.left = `${-999}px`;
        actionbar.style.display = "none";
        actionbar.style.background = "white";
        actionbar.style.padding = "4px 8px 12px 8px";
        actionbar.style.border = "1px solid #666";
        actionbar.style.display = "flex";
        actionbar.style.width = "90px";
        actionbar.style.justifyContent = "space-between";

        const mouse = new Vector2();
        const raycaster = new Raycaster();

        const onMouse = (event) => {
            const hideActionbar = () => {
                this.isActionActive = false;
                actionbar.style.display = "none";
            }

            if (event.type == "click") {
                hideActionbar();
                return;
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(
                this.boxGroup.children
            );

            const displayActionbar = (mouse, item) => {
                this.isActionActive = true;
                const x = (mouse.x + 1) / 2 * window.innerWidth;
                const y = -(mouse.y - 1) / 2 * window.innerHeight;

                actionbar.style.top = `${y}px`;
                actionbar.style.left = `${x + 16}px`;
                actionbar.style.display = "flex";

                const handleActions = (event) => {
                    if (event.target.classList.contains("add")) {
                        alert("cannot add yet")
                        hideActionbar();
                    } else if (event.target.classList.contains("remove")) {
                        alert("cannot remove yet");
                        hideActionbar();
                    }
                }

                actionbar.addEventListener("click", handleActions, {
                    once: true
                });
            }

            const hideTooltip = () => {
                const tooltip = document.getElementById("Tooltip");
                tooltip.style.display = "none";
            }

            if (intersects[0]) {
                const item = intersects[0].object;
                hideTooltip();
                displayActionbar(mouse, item);
            } else {
                hideActionbar();
            }
        }

        this.renderer.domElement.addEventListener("click", onMouse, false);
        this.renderer.domElement.addEventListener("contextmenu", onMouse, false);

    }

    createTooltip() {
        const title = document.createElement("p");
        title.classList.add("title");

        const stock = document.createElement("p");
        stock.classList.add("stock");

        const locWeight = document.createElement("p");
        locWeight.classList.add("loc_weight");

        const tooltip = document.createElement("div");
        tooltip.id = "Tooltip";
        tooltip.appendChild(title);
        tooltip.appendChild(stock);
        tooltip.appendChild(locWeight);

        this.container.appendChild(tooltip);

        tooltip.style.position = "absolute";
        tooltip.style.top = `${0}px`;
        tooltip.style.left = `${0}px`;
        tooltip.style.display = "none";
        tooltip.style.background = "white";
        tooltip.style.padding = "4px 8px 12px 8px";
        tooltip.style.border = "1px solid #666";

        const mouse = new Vector2();
        const raycaster = new Raycaster();

        const onMouse = (event) => {
            if (this.isActionActive) return;

            if (event.type == "mouseleave") {
                tooltip.style.display = "none";
                return;
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(
                this.boxGroup.children
            );

            const displayTooltip = (mouse, item) => {
                const x = (mouse.x + 1) / 2 * window.innerWidth;
                const y = -(mouse.y - 1) / 2 * window.innerHeight;

                tooltip.style.top = `${y}px`;
                tooltip.style.left = `${x + 16}px`;
                tooltip.style.display = "block";
                const title = tooltip.getElementsByClassName("title")[0];
                const stock = tooltip.getElementsByClassName("stock")[0];
                const locWeight = tooltip.getElementsByClassName("loc_weight")[0];
                title.textContent = "title: " + item.title;
                stock.textContent = "stock: " + item.stock;
                locWeight.textContent = "loc weight: " + item.locWeight;
            }

            if (intersects[0]) {
                const item = intersects[0].object;
                displayTooltip(mouse, item);
            } else {
                tooltip.style.display = "none";
            }
        }

        this.renderer.domElement.addEventListener("mousemove", onMouse, false);
        this.renderer.domElement.addEventListener("mouseleave", onMouse, false);
        this.renderer.domElement.addEventListener("click", onMouse, false);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addToScene(group, item) {
        const itemSize = util.map(item.stock, 0, 300, 0, 1);

        const color = new Color(util.getColorValue(item.locWeight, itemSize));
        const material = new MeshBasicMaterial({
            // color: Math.floor(Math.random() * 16777215),
            color: color,
            opacity: 0.9,
        });

        material.needsUpdate = true;

        const geometry = new BoxGeometry(
            this.blockSize,
            itemSize,
            this.blockSize
        );
        geometry.dynamic = true;

        geometry.translate(
            item.x + this.blockSize / 2 - this.div / 2,
            +itemSize / 2,
            item.z + this.blockSize / 2 - this.div / 2
        );

        // const edges = new EdgesGeometry(geometry);
        // const line = new LineSegments(
        //     edges,
        //     new LineBasicMaterial({ color: 0x85de95 })
        // );

        const box = new Mesh(geometry, material);
        box.title = item.id;
        box.stock = item.stock;
        box.locWeight = item.locWeight;

        group.add(box);
        // this.scene.add(line);
    }
}

export default Simulator;