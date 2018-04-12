Projection = {};

/**
 * Create an orthographic projection where size is roughly the desired number of world units to fit horizontally on
 * the screen.
 */
Projection.orthographic = function (width, height, size) {
    var aspect = width / height;
    return [
        1 / size, 0, 0, 0,
        0, aspect / size, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1];
};

/**
 * Create a perspective projection FOV and min and max clipping planes are provided.
 */
Projection.perspective = function (width, height, fov, zMin, zMax) {
    var a = width / height;
    var ang = Math.tan((fov * .5) * Math.PI / 180);
    return [
        0.5 / ang, 0, 0, 0,
        0, 0.5 * a / ang, 0, 0,
        0, 0, -(zMax + zMin) / (zMax - zMin), (-2 * zMax * zMin) / (zMax - zMin),
        0, 0, -1, 0];
};