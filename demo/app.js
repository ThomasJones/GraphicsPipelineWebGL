/**
 * Encapsulate the creation of the position, color, and index buffers.
 */
function Geometry(gl, positions, colors, indices) {
    var position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.render = function () {
        // Apply the buffers to the GPU and draw them, assuming the program / surface state has been setup
        // TODO - here or per attribute in the surface?
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    };

    this.bindPositionBuffer = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    };

    this.bindColorBuffer = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    };
}


/**
 * Encapsulate the vertex and fragment shaders and the binding to the appropriate uniform and vertex attributes.
 */
function Surface(gl, geometry) {
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

    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

    //geometry.bindPositionBuffer();
    var positionAttribute = gl.getAttribLocation(shaderProgram, "position");
    //gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0); //position
    //gl.enableVertexAttribArray(this.positionAttribute);

    //geometry.bindColorBuffer();
    var colorAttribute = gl.getAttribLocation(shaderProgram, "color");
    //gl.vertexAttribPointer(this.colorAttribute, 3, gl.FLOAT, false, 0, 0); //color
    //gl.enableVertexAttribArray(this.colorAttribute);

    this.apply = function (obj_matrix, view_matrix, proj_matrix) {

        // TODO - can these be moved into ctor?
        geometry.bindPositionBuffer();
        gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0); //position
        gl.enableVertexAttribArray(positionAttribute);

        geometry.bindColorBuffer();
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 0, 0); //color
        gl.enableVertexAttribArray(colorAttribute);

        // Activate the program and set the per-frame vars
        gl.useProgram(shaderProgram);
        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, obj_matrix);
    }
}

/**
 * Object in the scene containing geometry, a surface, and a transform.
 */
function SceneObject(geometry, surface) {
    var obj_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    this.update = function (dt) {
        rotateZ(obj_matrix, dt * 0.002);
    };

    this.render = function (view_matrix, proj_matrix) {
        surface.apply(obj_matrix, view_matrix, proj_matrix);
        geometry.render()
    }
}


function initApp(canvas) {
    var gl = canvas.getContext('experimental-webgl');

    var positions = [-1, -1, -1, 1, -1, -1, 1, 1, -1];
    var colors = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var indices = [0, 1, 2];

    var geometry = new Geometry(gl, positions, colors, indices);
    var surface = new Surface(gl, geometry);
    var sceneObject = new SceneObject(geometry, surface);

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

    var proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);
    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    //translating z
    view_matrix[14] = view_matrix[14] - 6; //zoom


    var time_old = 0;
    var renderFrame = function (time) {
        var dt = time - time_old;
        time_old = time;

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        sceneObject.update(dt);
        sceneObject.render(view_matrix, proj_matrix);

        window.requestAnimationFrame(renderFrame);
    };

    renderFrame(0);
}

function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c * m[0] - s * m[1];
    m[4] = c * m[4] - s * m[5];
    m[8] = c * m[8] - s * m[9];
    m[1] = c * m[1] + s * mv0;
    m[5] = c * m[5] + s * mv4;
    m[9] = c * m[9] + s * mv8;
}