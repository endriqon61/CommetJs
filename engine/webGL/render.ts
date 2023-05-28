/*

../../game/index.html

https://www.youtube.com

*/

export default class Commet {

    private gl: WebGL2RenderingContext;
    private cv;

    private currentRotation: any = [0, 1];
    private currentScale: any = [0.5, 0.5];

    private vertexArray: any = null;
    private vertexBuffer: any = null;
    private vertexNumComponents: any = null;
    private vertexCount: any = null;

    private aVertexPosition: any = null;

    private uniforms: any = { 
        uScalingFactor: null,
        uGlobalColor:  null,
        uRotationVector: null
    }

    private shaderProgram: any = null;
    private currentAngle: any = null;
    private previousTime: any = 0.0;
    private degreesPerSecond: any = 90.0;

    private aspectRatio: any = null;

    constructor(cv: HTMLCanvasElement) {
        this.cv = cv;
        const gl = cv.getContext("webgl2") as WebGL2RenderingContext
        this.gl = gl;
        if(gl == null) {
            alert("UNABLE to initialize WebGL. Your browser or machine may not support it")
            return;
        }
    }

    public get _gl() {
        return this.gl
    }


    public startup() {


        const shaderSet = [
            {
                type: this.gl.VERTEX_SHADER,
                id: "vertex-shader",
            },
            {
                type: this.gl.FRAGMENT_SHADER,
                id: "fragment-shader",
            },
        ];

        this.shaderProgram = this.buildShaderProgram(shaderSet);
        this.aspectRatio = this.cv.width / this.cv.height;
        this.currentRotation = [0, 1];
        this.currentScale = [0.5, this.aspectRatio/2];
        this.currentAngle = 0.0;


        this.animateScene();

    }

    setVertexPosition(array: number[]){

        this.vertexArray = new Float32Array(array);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexArray, this.gl.STATIC_DRAW);

        this.vertexNumComponents = 2;
        this.vertexCount = this.vertexArray.length / this.vertexNumComponents;


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

        this.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");

        this.gl.enableVertexAttribArray(this.aVertexPosition);

        this.gl.vertexAttribPointer(
            this.aVertexPosition,
            this.vertexNumComponents,
            this.gl.FLOAT,
            false,
            0,
            0
        );


    }

    public compileShader(id: string, type: any): WebGLShader {
        const code = document.getElementById(id)!.firstChild!.nodeValue as string;
        const shader = this.gl.createShader(type) as WebGLShader;

        this.gl.shaderSource(shader, code);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log(
            `Error compiling ${
                type === this.gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`
            );
            console.log(this.gl.getShaderInfoLog(shader));
        }
        return shader;
    } 

    buildShaderProgram(shaderInfo: any) {
        const program = this.gl.createProgram() as WebGLProgram

        shaderInfo.forEach((desc: any) => {
            const shader = this.compileShader(desc.id, desc.type);

            if (shader) {
            this.gl.attachShader(program, shader);
            }
        });

        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log("Error linking shader program:");
            console.log(this.gl.getProgramInfoLog(program));
        }

        return program;
    }

    setUniforms({uScalingFactor, uGlobalColor, uRotationVector}: any, currentScale: any[], currentRotation: any[]) {

        uScalingFactor = this.gl.getUniformLocation(this.shaderProgram, "uScalingFactor");
        uGlobalColor = this.gl.getUniformLocation(this.shaderProgram, "uGlobalColor");
        uRotationVector = this.gl.getUniformLocation(this.shaderProgram, "uRotationVector");

        this.gl.uniform2fv(uScalingFactor, currentScale);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        this.gl.uniform4fv(uGlobalColor, [0.6, 0.1, 0.8, 0.8]);

    }

    animateScene() {

        this.gl.viewport(0, 0, this.cv.width, this.cv.height);
        this.gl.clearColor(0.8, 0.9, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);


        const radians = (this.currentAngle * Math.PI) / 180.0;
        //this.currentRotation[0] = Math.sin(radians);
        //this.currentRotation[1] = Math.cos(radians);


        this.setUniforms(this.uniforms, this.currentScale, this.currentRotation)

        this.gl.useProgram(this.shaderProgram);

        this.setVertexPosition([
            -0.5, 
            0.5,
            0.7 ,
            0.7,
            -0.7,
            -0.7,
            0.5, 
            -0.5, 
            0.7, 
            0.7, 
            -0.7, 
            -0.7
        ])

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);

        this.setVertexPosition([

            -0.5 + 1.4, 
            0.5,
            0.7  + 1.4,
            0.7,
            -0.7 + 1.4,
            -0.7,
        ])

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);

        requestAnimationFrame((currentTime) => {
            const deltaAngle =
            ((currentTime - this.previousTime) / 1000.0) * this.degreesPerSecond;

            this.currentAngle = (this.currentAngle + deltaAngle) % 360;

            this.previousTime = currentTime;
            this.animateScene();
        });
    }




    clear(r: number, g: number, b: number, a: number) {
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }







}