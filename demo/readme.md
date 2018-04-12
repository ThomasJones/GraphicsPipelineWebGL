# The Graphics Pipeline
## A tech talk about modern graphics, 3D math, and WebGL
#### Why is this Relevant?
The modern graphics pipeline is a powerful tool that powers almost every modern device with a screen. The increase in computing power and the rise of accessibility to the GPU from both browsers and mobile platforms makes knowledge of the underlying graphics system important.

##### Mobile Frameworks
Mobile frameworks (iOS and Android) are built on top of graphics apis for performant hardware accelerated rendering. It's good to understand the low-level on which the frameworks we work on are implemented.
##### Unity
Unity is becoming a more common tool in the development of applications, in particular real-time and graphically intense apps.
##### VR / AR
These hot new technologies are by their nature modelling 3D space and utilizing the graphics pipeline and 3D mathematical principles to a high degree.

## Mathematics of 3D Graphics
### Math primer
#### Vector arithmetic
Addition, subtraction, multiplication, dot product, cross product

#### Matrix arithmetic
Addition
Scalar multiplication
Transposition
- `(A^t)A^t = A`

Multiplication
- `AB != BA` - non-commutative!
- `A(BC) = (AB)C` = associative

Inversion
- `(AB)^-1 = (B^1)x(A^-1)`

Multiplication with vectors, transforming points
 - `Av = v'`
 - `(BA)v = B(Av) = BAv`

### Matrix as a transform
- Special type of matrix, orthonormal column vectors / basis vectors
- All column vectors must be perpendicular to each other

### Coordinate systems
- Model / Object -> World -> Camera -> Screen
- Handedness -thumb-X, index-Y, middle-Z
- Row vs column major / column vector vs row vector / left-to-right vs right-to-left
### Scene graph
A structure that represents transform hierarchies as a graph
Optimized spatial queries, visibility checks, heirarchical transformations, node sorting
Important for any non-trivial rendering of geometry 
### Camera Transform
Convert the world/global-space coordinates of the objects in the scene relative to the camera
### Projection Transform
Normalized Device Coordinates
Perspective & Orthographic projections

### Quaternions
Represent a rotation in 3d with a 4d vector that has 3 components that are complex numbers
Unity’s Transform object and why it’s awesome

## Graphics Pipeline
The means by which an application utilizes the graphics device capabilities to display images in an optimized way. The entire point is to write to the device frame buffer for display.
* Application -> Geometry -> Rasterization -> Display
* Graphics pipeline = F(geometry, surface & object properties, camera & projection transforms) -> frame buffer image
 
https://commons.wikimedia.org/wiki/File:The_OpenGL_-_DirectX_graphics_pipeline.png

### Graphics APIs
Low level into the capabilities of a graphics pipeline - an SDK into the GPU
WebGL, OpenGL, Vulkan, Metal, DirectX
NOT a scene-graph, game engine, render loop, asset pipeline,etc

### Representing Geometry
* Vertex buffer
* Index buffer
* Winding order
* Geometry type (Triangle list, strip, lines, etc)
* Vertex Formats & Semantics

### Representing Surface
Texture - an image that is projected onto geometry
Material - common name for a combination of textures, colors, visual parameters, and shaders that define how colors are calculated per pixel.
Lighting - how light interacts with the surface, shininess or dullness.
#### Shader 
A ‘program’ that runs on the GPU for a pre-defined stage in the pipeline, such per vertex or per fragment. A shader is responsible for transforming and 'shading' the geometry as it is drawn to the framebuffer. It can take in various parameters ranging from textures to app-specified values, lights, and calculate vertex position and pixel color programmatically per vertex or pixel in a highly parallel fashion.
* Types - Vertex, Pixel/Fragment, Geometry, (Compute, Tessellation)
* Vertex shader = `F(app vertex data) -> data for pixel shader, with positions transformed into projection space`
* Fragment/Pixel shader = `F(vertex shader output) -> color to display`

##### Terminology
Vertex - a single point of a set of geometry, at a minimum a position, but can have additional attributes such as color, uv-coords, etc.
Uniform - per-frame variable, such as object transform, view and projection transform, object color
Attribute - per-vertex variable, such as position, color, uv-coordinates
Varying - a value passed from vertex shader to the pixel shader, automatically being interpolated across the surface of the geometry

### Pipeline Usage
Define frame buffer and depth buffer size and format
Create Shaders
Define geometry
 - Vertices - positions (tex-coords, colors)
 - Indices - index into the vertices to define triangles or other groups of primitives

Per frame:
- Clear the framebuffer and depth buffer
- Calculate a view and projection matrix
- For each object in the scene*:
-- Activate a shader
-- Apply per-frame uniforms for the given object
-- Apply the vertex attribute buffers
-- Apply the index buffer
-- Issue draw call
*Per object is a naive approach but easier to understand - usually you sort on materials and geometry as an optimization to minimize the state changes of the graphics device

### Pipeline in Action
1. Application pushes geometry and issues draw calls with associated transforms
2. Vertex pipeline takes the geometry and applies the vertex shader to all vertices rendered with that shader - the shader is mostly responsible for transforming all the vertex positions from model space to projection space. The vertex shader may also send additional per-vertex values.
3. Tessellation and Geometry shaders.
4. Primitive assembly, clipping, viewport transform, culling, rasterization.
5. Pixel shader is run on the pixels the geometry takes up in projection space. Varying values from the vertex shader have been interpolated. Texture sampling, light, and view-dependent calculations occur here and a final color is output for the pixel to the framebuffer.
5. Framebuffer operations do depth and stencil testing befure commiting pixels to the framebuffer. Final pixel blending based on render states such as alpha blending occurs here.
6. The graphics driver may wait until the next vsync before switching the backbuffer, causing the frame to be updated.

### Troubleshooting and Other Topics
Handedness - +z or -z
Platform specific mappings - NDC between OpenGL vs. DirectX
Transforms and current coordinate system
Vertex winding order / back/front-face culling
Depth culling / testing
Vsync, GPU-CPU synchronization
Advanced rendering

## WebGL Demo
## Questions?
