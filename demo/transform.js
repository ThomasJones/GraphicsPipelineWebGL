/**
 * A Unity-like transform for an object in 3D space, consisting of position, rotation, and scale. Each a separate
 * component so they can be modified independently.
 */
function Transform(translation) {
    this.translation = translation;
    this.rotation = Matrix.identity();
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
        this.rotation = Matrix.multiply(this.rotation, rotate);  // TODO - order here
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
        var s = Matrix.scale(this.scale);
        var t = Matrix.translate(this.translation);
        return Matrix.multiply(Matrix.multiply(t, this.rotation), s);
    }
}
