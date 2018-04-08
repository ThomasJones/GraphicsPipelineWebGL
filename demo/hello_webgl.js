var canvas
var gl
var Pmatrix
var Vmatrix
var Mmatrix
var proj_matrix
var mov_matrix
var view_matrix
var index_buffer
var vertices = [-1, -1, -1, 1, -1, -1, 1, 1, -1];
var colors = [1, 0, 0,
    0, 1, 0,
    0, 0, 1];
var indices = [0, 1, 2];
var vertex_buffer
var color_buffer

function helloWebGL(inCanvas, window) {
    canvas = inCanvas
    gl = canvas.getContext('experimental-webgl');

    /*===========Defining and storing the geometry==============*/

    // var vertices = [-1, -1, -1, 1, -1, -1, 1, 1, -1];
    // var colors = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    // var indices = [0, 1, 2];

    //Create and store data into vertex buffer
    vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Create and store data into color buffer
    color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    //Create and store data into index buffer
    index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    /*==========================Shaders=========================*/

    var vertCode = 'attribute vec3 position;' +
        'uniform mat4 Pmatrix;' +
        'uniform mat4 Vmatrix;' +
        'uniform mat4 Mmatrix;' +
        'attribute vec3 color;' +//the color of the point
        'varying vec3 vColor;' +

        'void main(void) { ' +//pre-built function
        'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
        'vColor = color;' +
        '}';

    var fragCode = 'precision mediump float;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
        'gl_FragColor = vec4(vColor, 1.);' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    /*===========associating attributes to vertex shader ============*/

    Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var position = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0); //position
    gl.enableVertexAttribArray(position);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0); //color
    gl.enableVertexAttribArray(color);
    gl.useProgram(shaderProgram);

    /*========================= MATRIX ========================= */

    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);
    mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    //translating z
    view_matrix[14] = view_matrix[14] - 6; //zoom


    var time_old = 0;
    var animate = function(time) {
        var dt = time-time_old;
        time_old = time;

        rotateZ(mov_matrix, dt * 0.002);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

        // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        // gl.enableVertexAttribArray(position);
        //
        // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        // gl.enableVertexAttribArray(color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        window.requestAnimationFrame(animate);
    }

    animate(0);
}

function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];
    m[1] = c*m[1]+s*mv0;
    m[5] = c*m[5]+s*mv4;
    m[9] = c*m[9]+s*mv8;
}