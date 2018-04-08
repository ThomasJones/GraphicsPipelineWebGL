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
        // TODO - here or per attribute in the surface?
        // Apply the buffers to the GPU and draw them, assuming the program / surface state has been setup
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

