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


function degToRad(deg) {
    return deg * Math.PI / 180
}

Matrix = {};
Matrix.identity = function () {
    return [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
};

Matrix.transpose = function (m) {
    return [m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]]
};

Matrix.multiply = function (m1, m2) {
    // each row m1 * col m2
    var row0 = Matrix.row(m1, 0);
    var row1 = Matrix.row(m1, 1);
    var row2 = Matrix.row(m1, 2);
    var row3 = Matrix.row(m1, 3);
    var col0 = Matrix.column(m2, 0);
    var col1 = Matrix.column(m2, 1);
    var col2 = Matrix.column(m2, 2);
    var col3 = Matrix.column(m2, 3);
    return [row0.dot(col0), row0.dot(col1), row0.dot(col2), row0.dot(col3),
        row1.dot(col0), row1.dot(col1), row1.dot(col2), row1.dot(col3),
        row2.dot(col0), row2.dot(col1), row2.dot(col2), row2.dot(col3),
        row3.dot(col0), row3.dot(col1), row3.dot(col2), row3.dot(col3)]
};

Matrix.row = function (m, row) {
    var i = 4 * row;
    return new Vector4(m[i], m[i + 1], m[i + 2], m[i + 3])
};

Matrix.column = function (m, col) {
    return new Vector4(m[col], m[col + 4], m[col + 8], m[col + 12])
};


Matrix.rotateX = function (theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1]
};

Matrix.rotateY = function (theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1]
};

Matrix.rotateZ = function (theta) {
    var rad = degToRad(theta);
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
};

Matrix.translate = function(translation) {
    return [1, 0, 0, translation.x,
        0, 1, 0, translation.y,
        0, 0, 1, translation.z,
        0, 0, 0, 1];
};

Matrix.scale = function (scale) {
    return [scale.x, 0, 0, 0,
        0, scale.y, 0, 0,
        0, 0, scale.z, 0,
        0, 0, 0, 1];
};
