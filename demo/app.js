function initApp(canvas) {
    var gl = canvas.getContext('experimental-webgl');

    var onUpdate = function (transform) {
        transform.translate(new Vector(0.005, 0, 0));
        transform.rotate(Matrix.rotateZ(-1));
    };

    var quad = GeometryFactory.makeQuad(gl);// new Geometry(gl, positions, colors, indices);
    var cube = GeometryFactory.makeCube(gl);
    var surface = new Surface(gl, quad);
    var cubeSurface = new Surface(gl, cube);
    var sceneObjects = [];
    sceneObjects.push(new SceneObject(quad, surface, new Transform(new Vector(0, 0, 0)).setRotation(Matrix.rotateZ(90)), new Color(1, 0, 0), onUpdate));
    sceneObjects.push(new SceneObject(quad, surface, new Transform(new Vector(5, 0, 0)).setScale(new Vector(2, 0.5, 1)), new Color(0, 1, 0), onUpdate));
    sceneObjects.push(new SceneObject(cube, cubeSurface, new Transform(new Vector(-3, -3, 0)), new Color(0, 0, 1)));
    sceneObjects.push(new SceneObject(quad, surface, new Transform(new Vector(-3, 3, -3)), new Color(1, 0, 1)));
    sceneObjects.push(new SceneObject(quad, surface, new Transform(new Vector(-3, 4, 3)), new Color(0, 1, 1)));
    sceneObjects.push(new SceneObject(cube, cubeSurface, new Transform(new Vector(-1, -2, -2)).setScale(new Vector(3, 1, 0.5)), new Color(1, 0.75, 0), onUpdate));
    sceneObjects.push(new SceneObject(quad, surface,
        new Transform(new Vector(0, -5, 0))
            .setScale(new Vector(10, 10, 10))
            .setRotation(Matrix.rotateX(90))
        , new Color(0.3, 0.3, 0.3)));

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

    var camera_angles = [0, 0];
    var camera_pos = new Vector(0, 0, -6);
    var proj_matrix = get_projection(60, canvas.width / canvas.height, 1, 100);
    proj_matrix = Matrix.transpose(proj_matrix);

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

        var cam_yaw = Matrix.rotateY(camera_angles[0]);
        var cam_pitch = Matrix.rotateX(camera_angles[1]);
        var cam_rotation = Matrix.multiply(cam_pitch, cam_yaw);
        var view_matrix = new Transform(camera_pos).setRotation(cam_rotation).toMatrix();

        sceneObjects.forEach(obj => obj.update(dt));
        sceneObjects.forEach(obj => obj.render(view_matrix, proj_matrix));

        window.requestAnimationFrame(renderFrame);
    };

    renderFrame(0);

    window.addEventListener("keydown", function (event) {
        var key = String.fromCharCode(event.which);
        if (key === "A") camera_pos.x += 1;
        if (key === "D") camera_pos.x -= 1;
        if (key === "W") camera_pos.z += 1;
        if (key === "S") camera_pos.z -= 1;
        if (key === "E") camera_pos.y += 1;
        if (key === "Q") camera_pos.y -= 1;
        if (event.which == 37) camera_angles[0] -= 1; //left
        if (event.which == 38) camera_angles[1] += 1; //up
        if (event.which == 39) camera_angles[0] += 1; //right
        if (event.which == 40) camera_angles[1] -= 1; //down
    });
}