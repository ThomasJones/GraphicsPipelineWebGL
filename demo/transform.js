function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Transform(position) {
    this.position = position;

    this.toMatrix = function () {
        return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            position.x, position.y, position.z, 1];
    }
}
