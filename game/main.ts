import Commet from "../engine/webGL/render.js";
const canvas = document.getElementById("canvas") as HTMLCanvasElement


const commet = new Commet(canvas);

window.addEventListener("load", () => {

    commet.startup()

})

