

function SceneProperties(view_matrix, proj_matrix) {
    this.view_matrix = view_matrix;
    this.proj_matrix = proj_matrix;
}

function ObjectProperties(matrix, color) {
    this.matrix = matrix;
    this.color = color;
}

/**
 * Encapsulate the vertex and fragment shaders and the binding to the appropriate uniform and vertex attributes.
 */
function Surface(gl, geometry) {
    var vertCode = 'attribute vec3 position;' +
        'attribute vec3 color;' +//the color of the point
        'uniform mat4 Pmatrix;' +
        'uniform mat4 Vmatrix;' +
        'uniform mat4 Mmatrix;' +
        'uniform vec3 objectColor;' +
        'varying vec3 vColor;' +

        'void main(void) { ' +//pre-built function
        //'gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);' +
        'gl_Position = vec4(position, 1.) * Mmatrix * Vmatrix * Pmatrix;' +
        'vColor = color * objectColor;' +       // TODO - just preventing warnings for now.
        'vColor = objectColor;' +
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
    var objectColor = gl.getUniformLocation(shaderProgram, "objectColor");

    //geometry.bindPositionBuffer();
    var positionAttribute = gl.getAttribLocation(shaderProgram, "position");
    //gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0); //position
    //gl.enableVertexAttribArray(this.positionAttribute);

    //geometry.bindColorBuffer();
    var colorAttribute = gl.getAttribLocation(shaderProgram, "color");
    //gl.vertexAttribPointer(this.colorAttribute, 3, gl.FLOAT, false, 0, 0); //color
    //gl.enableVertexAttribArray(this.colorAttribute);

    this.apply = function (objectProperties, sceneProperties) {

        // TODO - can these be moved into ctor?
        geometry.bindPositionBuffer();
        gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0); //position
        gl.enableVertexAttribArray(positionAttribute);

        geometry.bindColorBuffer();
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 0, 0); //color
        gl.enableVertexAttribArray(colorAttribute);

        // Activate the program and set the per-frame vars
        gl.useProgram(shaderProgram);
        gl.uniformMatrix4fv(Pmatrix, false, sceneProperties.proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, sceneProperties.view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, objectProperties.matrix);
        gl.uniform3f(objectColor, objectProperties.color.r, objectProperties.color.g, objectProperties.color.b);
    }
}

