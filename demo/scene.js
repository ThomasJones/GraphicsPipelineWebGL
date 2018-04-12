/**
 * Object in the scene containing geometry, a surface, and a transform.
 */
function SceneObject(geometry, surface, transform, color, onUpdate = null) {
    this.update = function (dt) {
        if (onUpdate !== null) {
            onUpdate(transform);
        }
        this.matrix = transform.toMatrix();
    };

    this.render = function (sceneProperties) {
        surface.apply(new ObjectProperties(this.matrix, color), sceneProperties);
        geometry.render()
    }
}

/**
 * Object in the scene that simply has a matrix that is set externally.
 */
function MatrixSceneObject(geometry, surface, matrix, color) {
    this.matrix = matrix;
    this.update = function (dt) {};

    this.render = function (sceneProperties) {
        surface.apply(new ObjectProperties(this.matrix, color), sceneProperties);
        geometry.render()
    };
}
