import Commet from "../engine/webGL/render.js";
const canvas = document.getElementById("canvas") as HTMLCanvasElement


const commet = new Commet(canvas);

window.addEventListener("load", () => {

    const rect = commet.createRectangle(1, 0.5, {x: 0.5, y: 0.2});
    const rect2 = commet.createRectangle(0.5, 0.5, {x: -1, y: -1});
    const rect3 = commet.createRectangle(0.2, 0.2, {x: -1, y: 0.7});

    commet.startup()

})

