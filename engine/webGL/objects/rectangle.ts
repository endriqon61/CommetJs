import type { pos } from "../interfaces/object";

export class Rectangle {

    private width: number;
    private height: number;
    private pos: pos;
    private rotationInDeg: number;

    constructor(width: number, height: number, pos: pos = {x: 0, y: 0}, rotation: number = 0) { 

        this.width = width
        this.height = height
        this.pos = pos
        this.rotationInDeg = rotation;

    }

    public setPosition(pos: pos) {
        this.pos = pos
    }

    public setRotation(rot: number) {
        this.rotationInDeg = rot
    }

}
