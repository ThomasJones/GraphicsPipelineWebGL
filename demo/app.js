function initApp(canvas) {
    var gl = canvas.getContext('experimental-webgl');

    var onUpdate = function (transform) {
        transform.translate(new Vector(0.005, 0, 0));
        transform.rotate(Matrix.rotateZ(-1));
    };

    var quad = GeometryFactory.makeQuad(gl);
    var cube = GeometryFactory.makeCube(gl);
    var quadSurface = new Surface(gl, quad);
    var cubeSurface = new Surface(gl, cube);
    var sceneObjects = [];
    sceneObjects.push(new SceneObject(quad, quadSurface, new Transform(new Vector(0, 0, 0)).setRotation(Matrix.rotateZ(90)), new Color(1, 0, 0), onUpdate));
    sceneObjects.push(new SceneObject(quad, quadSurface, new Transform(new Vector(5, 0, 0)).setScale(new Vector(2, 0.5, 1)), new Color(0, 1, 0), onUpdate));
    sceneObjects.push(new SceneObject(cube, cubeSurface, new Transform(new Vector(-3, -3, 0)), new Color(0, 0, 1)));
    sceneObjects.push(new SceneObject(quad, quadSurface, new Transform(new Vector(-3, 3, -3)), new Color(1, 0, 1)));
    sceneObjects.push(new SceneObject(quad, quadSurface, new Transform(new Vector(-3, 4, 3)), new Color(0, 1, 1)));
    sceneObjects.push(new SceneObject(cube, cubeSurface, new Transform(new Vector(-1, -2, -2)).setScale(new Vector(3, 1, 0.5)), new Color(1, 0.75, 0), onUpdate));
    sceneObjects.push(new SceneObject(quad, quadSurface,
        new Transform(new Vector(0, -5, 0))
            .setScale(new Vector(10, 10, 10))
            .setRotation(Matrix.rotateX(90))
        , new Color(0.3, 0.3, 0.3)));

    var matrixObj1 = new MatrixSceneObject(cube, cubeSurface, Matrix.identity(), new Color(1, 0, 0));
    var matrixObj2 = new MatrixSceneObject(cube, cubeSurface, Matrix.identity(), new Color(0, 1, 0));

    var matrixExampleUpdate = function (dt, frame) {
        var m1 = new MatrixBuilder()
            .scale(2, 0.5, 0.5)
            .rotateX(frame)
            .rotateZ(frame)
            .translate(-2, 2, -2.1);

        var m2 = new MatrixBuilder()
            .scale(2, 0.5, 0.5)
            .translate(-2, 0, 0)
            .rotateZ(frame)
            .translate(2, 0, 0)
            .translate(-2, 2, -2.2);

        matrixObj1.matrix = m1.m;
        matrixObj2.matrix = m2.m;
    };

    sceneObjects.push(matrixObj1);
    sceneObjects.push(matrixObj2);

    var camera_angles = [0, 0];
    var camera_pos = new Vector(0, 0, -6);
    var proj_matrix = Projection.perspective(canvas.width, canvas.height, 60, 1, 100);

    var time_old = 0;
    var frame = 0;
    var renderFrame = function (time) {
        var dt = time - time_old;
        time_old = time;

        frame += 1;

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

        matrixExampleUpdate(dt, frame);

        var sceneProperties = new SceneProperties(view_matrix, proj_matrix);
        sceneObjects.forEach(obj => obj.update(dt));
        sceneObjects.forEach(obj => obj.render(sceneProperties));

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

    this.clickOrthographic = function() {
        proj_matrix = Projection.orthographic(canvas.width, canvas.height, 11);
    };

    this.clickPerspective = function() {
        proj_matrix = Projection.perspective(canvas.width, canvas.height, 60, 1, 100);
    };

}