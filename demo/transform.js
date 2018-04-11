function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function vector3Add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

function Vector4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.dot = function (v) {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z) + (this.w * v.w);
    }
}

function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function matrixIdentity() {
    return [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
}

function matrixTranspose(m) {
    return [m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]]
}

function matrixMultiply(m1, m2) {
    // each row m1 * col m2
    var row0 = matrixRow(m1, 0);
    var row1 = matrixRow(m1, 1);
    var row2 = matrixRow(m1, 2);
    var row3 = matrixRow(m1, 3);
    var col0 = matrixColumn(m2, 0);
    var col1 = matrixColumn(m2, 1);
    var col2 = matrixColumn(m2, 2);
    var col3 = matrixColumn(m2, 3);
    return [row0.dot(col0), row0.dot(col1), row0.dot(col2), row0.dot(col3),
        row1.dot(col0), row1.dot(col1), row1.dot(col2), row1.dot(col3),
        row2.dot(col0), row2.dot(col1), row2.dot(col2), row2.dot(col3),
        row3.dot(col0), row3.dot(col1), row3.dot(col2), row3.dot(col3)]
}

function matrixRow(m, row) {
    var i = 4 * row;
    return new Vector4(m[i], m[i + 1], m[i + 2], m[i + 3])
}

function matrixColumn(m, col) {
    return new Vector4(m[col], m[col + 4], m[col + 8], m[col + 12])
}

function degToRad(deg) {
    return deg * Math.PI / 180
}

function matrixCreateRotateX(theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1]
}

function matrixCreateRotateY(theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1]
}

function matrixCreateRotateZ(theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
}

function matrixTranslation(translation) {
    return [1, 0, 0, translation.x,
        0, 1, 0, translation.y,
        0, 0, 1, translation.z,
        0, 0, 0, 1];
}

function matrixScale(scale) {
    return [scale.x, 0, 0, 0,
        0, scale.y, 0, 0,
        0, 0, scale.z, 0,
        0, 0, 0, 1];
}

function Transform(translation) {
    this.translation = translation;
    this.rotation = matrixIdentity();
    this.scale = new Vector(1, 1, 1);

    this.translate = function (translation) {
        this.translation = vector3Add(this.translation, translation);
        return this;
    };

    this.setTranslation = function (translation) {
        this.translation = translation;
        return this;
    };

    this.rotate = function (rotate) {
        this.rotation = matrixMultiply(this.rotation, rotate);  // TODO - order here
        return this;
    };

    this.setRotation = function (rotation) {
        this.rotation = rotation;
        return this;
    };

    this.setScale = function (scale) {
        this.scale = scale;
        return this;
    };

    this.toMatrix = function () {
        var s = matrixScale(this.scale);
        var t = matrixTranslation(this.translation);
        return matrixMultiply(matrixMultiply(t, this.rotation), s);
    }
}
