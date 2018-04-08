/**
 * Object in the scene containing geometry, a surface, and a transform.
 */
function SceneObject(geometry, surface, transform) {
    this.update = function (dt) {

    };

    this.render = function (view_matrix, proj_matrix) {
        var obj_matrix = transform.toMatrix();
        surface.apply(obj_matrix, view_matrix, proj_matrix);
        geometry.render()
    }
}
