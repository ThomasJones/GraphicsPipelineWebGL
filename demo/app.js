function initApp(canvas) {
    var gl = canvas.getContext('experimental-webgl');

    var positions = [-1, -1, -1, 1, -1, -1, 1, 1, -1];
    var colors = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var indices = [0, 1, 2];

    var geometry = new Geometry(gl, positions, colors, indices);
    var surface = new Surface(gl, geometry);
    var sceneObjects = [];
    sceneObjects.push(new SceneObject(geometry, surface, new Transform(new Vector(0,0,0))));
    sceneObjects.push(new SceneObject(geometry, surface, new Transform(new Vector(5,0,0))));
    sceneObjects.push(new SceneObject(geometry, surface, new Transform(new Vector(-3,-3,0))));
    sceneObjects.push(new SceneObject(geometry, surface, new Transform(new Vector(-3,3,-3))));

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


        sceneObjects.forEach( obj => obj.update(dt));
        sceneObjects.forEach( obj => obj.render(view_matrix, proj_matrix));

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