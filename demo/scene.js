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

    this.render = function (view_matrix, proj_matrix) {
        surface.apply(new ObjectProperties(this.matrix, color), new SceneProperties(view_matrix, proj_matrix));
        geometry.render()
    }
}
