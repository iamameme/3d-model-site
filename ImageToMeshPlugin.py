import tempfile
import queue
import threading
import subprocess
import sys
import os
from bpy.types import Operator, Panel
from bpy_extras.io_utils import ImportHelper
from bpy.props import StringProperty, FloatProperty, PointerProperty, BoolProperty
import bmesh
import bpy
import argparse

bl_info = {
    "name": "Image to 3D Mesh",
    "blender": (3, 0, 0),
    "category": "Object",
    "author": "Steven Barsam",
    "version": (1, 10),
    "description": "Creates a fully enclosed 3D mesh from an image with transparency"
}


install_queue = queue.Queue()
install_triggered = False
install_started = False

REQUIRED_PACKAGES = {
    "numpy": "numpy",
    "PIL": "Pillow",
    "skimage": "scikit-image",
    "cv2": "opencv-python-headless"
}


class MESSAGEBOX_OT_simple(bpy.types.Operator):
    bl_idname = "message.box"
    bl_label = "Message"
    message: bpy.props.StringProperty()

    def execute(self, context): return {'FINISHED'}

    def invoke(self, context, event):
        message_copy = self.message

        def draw(self_inner, _):
            self_inner.layout.label(text=message_copy)

        context.window_manager.popup_menu(
            draw, title="Dependency Installer", icon='INFO')
        return {'FINISHED'}


class INSTALL_OT_modal(bpy.types.Operator):
    bl_idname = "install.deps_modal"
    bl_label = "Installing Dependencies..."

    _timer = None
    _thread = None

    def modal(self, context, event):
        if event.type == 'TIMER':
            try:
                msg = install_queue.get_nowait()
                if msg == "DONE":
                    bpy.ops.message.box(
                        'INVOKE_DEFAULT', message="✅ Dependencies installed successfully!")
                    self.cancel(context)
                    return {'FINISHED'}
                elif msg.startswith("ERROR"):
                    bpy.ops.message.box('INVOKE_DEFAULT', message=msg)
                    self.cancel(context)
                    return {'CANCELLED'}
            except queue.Empty:
                pass
        return {'PASS_THROUGH'}

    def invoke(self, context, event):
        wm = context.window_manager
        self._timer = wm.event_timer_add(0.2, window=context.window)
        wm.modal_handler_add(self)
        self._thread = threading.Thread(target=self.install_packages)
        self._thread.start()
        return {'RUNNING_MODAL'}

    def cancel(self, context):
        context.window_manager.event_timer_remove(self._timer)

    def install_packages(self):
        try:
            subprocess.check_call([sys.executable, "-m", "ensurepip"])
        except:
            pass
        for module, package in REQUIRED_PACKAGES.items():
            try:
                __import__(module)
            except ImportError:
                try:
                    install_queue.put(f"Installing {package}...")
                    subprocess.check_call(
                        [sys.executable, "-m", "pip", "install", package])
                except Exception as e:
                    install_queue.put(f"ERROR installing {package}: {e}")
                    return
        install_queue.put("DONE")


def trigger_install_later():
    global install_started
    if not install_started:
        install_started = True
        bpy.ops.install.deps_modal('INVOKE_DEFAULT')
    return None

# === Image Mesh Logic ===


def image_to_outer_curve_arr(image_path, simplicity, min_length, threshold=0.1, pixels_per_unit=100.0):
    from skimage import measure
    from PIL import Image
    import numpy as np
    import bpy
    import cv2

    # Load image and alpha mask
    img = Image.open(image_path).convert("RGBA")
    alpha = np.array(img)[:, :, 3] / 255.0
    mask = alpha > threshold
    mask = np.pad(mask, pad_width=1, mode='constant', constant_values=False)

    # Find contours
    raw_contours = measure.find_contours(mask, 0.8)
    raw_contours = sorted(raw_contours, key=lambda x: len(x), reverse=True)
    # Only use 1 contour, the largest

    def contour_length(contour):
        # Sum of Euclidean distances between consecutive points
        return np.sum(np.sqrt(np.sum(np.diff(contour, axis=0)**2, axis=1)))
    # raw_contours = [raw_contours[0]]
    raw_contours = [
        c for c in raw_contours if contour_length(c) >= min_length
    ]

    contours = []
    epsilon = simplicity

    for c in raw_contours:
        contour = c.astype(np.float32).reshape((-1, 1, 2))
        approx = cv2.approxPolyDP(contour, epsilon, True).reshape(-1, 2)

        if len(approx) >= 4 and not np.any(np.isnan(approx)):
            contours.append(approx)

    if not contours:
        print("No usable contours found.")
        return []

    # Just keep the largest contour (no holes)
    contours = sorted(contours, key=len, reverse=True)
    contours = [
        c for c in contours if contour_length(c) >= min_length
    ]
    # contours = [c for c in contours if len(c) >= min_points]

    curves = []
    # Create curve
    for contour in contours:
        curve_data = bpy.data.curves.new(name="OuterContour", type='CURVE')
        curve_data.dimensions = '2D'
        curve_data.fill_mode = 'BOTH'
        curve_data.extrude = 0.01

        spline = curve_data.splines.new('BEZIER')
        spline.bezier_points.add(len(contour) - 1)
        spline.use_cyclic_u = True

        for i, point in enumerate(contour):
            x = point[1] / pixels_per_unit
            y = point[0] / pixels_per_unit
            bp = spline.bezier_points[i]
            bp.co = (x, y, 0)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'

        curve_obj = bpy.data.objects.new("OuterCurve", curve_data)
        bpy.context.collection.objects.link(curve_obj)
        curves.append(curve_obj)

    return curves


def image_to_outer_curve(image_path, simplicity, threshold=0.1, pixels_per_unit=100.0):
    from skimage import measure
    from PIL import Image
    import numpy as np
    import bpy
    import cv2

    # Load image and alpha mask
    img = Image.open(image_path).convert("RGBA")
    alpha = np.array(img)[:, :, 3] / 255.0
    mask = alpha > threshold
    mask = np.pad(mask, pad_width=1, mode='constant', constant_values=False)

    # Find contours
    raw_contours = measure.find_contours(mask, 0.8)
    raw_contours = sorted(raw_contours, key=lambda x: len(x), reverse=True)
    # Only use 1 contour, the largest
    # raw_contours = [raw_contours[0]]
    min_points = 50  # adjust this threshold based on your needs
    raw_contours = [c for c in raw_contours if len(c) >= min_points]

    contours = []
    epsilon = simplicity

    for c in raw_contours:
        contour = c.astype(np.float32).reshape((-1, 1, 2))
        approx = cv2.approxPolyDP(contour, epsilon, True).reshape(-1, 2)

        if len(approx) >= 4 and not np.any(np.isnan(approx)):
            contours.append(approx)

    if not contours:
        print("No usable contours found.")
        return []

    # Just keep the largest contour (no holes)
    contours = sorted(contours, key=len, reverse=True)
    contour = contours[0]

    # Create curve
    curve_data = bpy.data.curves.new(name="OuterContour", type='CURVE')
    curve_data.dimensions = '2D'
    curve_data.fill_mode = 'BOTH'
    curve_data.extrude = 0.01

    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(len(contour) - 1)
    spline.use_cyclic_u = True

    for i, point in enumerate(contour):
        x = point[1] / pixels_per_unit
        y = point[0] / pixels_per_unit
        bp = spline.bezier_points[i]
        bp.co = (x, y, 0)
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'

    curve_obj = bpy.data.objects.new("OuterCurve", curve_data)
    bpy.context.collection.objects.link(curve_obj)

    return curve_obj


def curve_to_mesh(curve_obj, extrude_depth):
    bpy.context.view_layer.objects.active = curve_obj
    curve_obj.select_set(True)
    if curve_obj.type == 'CURVE':
        curve_obj.data.extrude = extrude_depth
        curve_obj.data.bevel_depth = 0
        curve_obj.data.use_fill_caps = True
        bpy.ops.object.convert(target='MESH')
    if curve_obj.type == 'MESH':
        mod = curve_obj.modifiers.new(name="Decimate", type='DECIMATE')
        mod.decimate_type = 'COLLAPSE'
        mod.ratio = 0.2
        bpy.context.view_layer.objects.active = curve_obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return curve_obj


def curve_to_mesh_rounded(curve_obj, extrude_depth):
    bpy.context.view_layer.objects.active = curve_obj
    curve_obj.select_set(True)

    if curve_obj.type == 'CURVE':
        curve_obj.data.extrude = extrude_depth
        curve_obj.data.bevel_depth = extrude_depth / 0.8  # Half-height radius rounding
        curve_obj.data.bevel_resolution = 8  # Increase for smoother roundness
        curve_obj.data.use_fill_caps = True

        bpy.ops.object.convert(target='MESH')

    if curve_obj.type == 'MESH':
        mod = curve_obj.modifiers.new(name="Decimate", type='DECIMATE')
        mod.decimate_type = 'COLLAPSE'
        mod.ratio = 0.2
        bpy.context.view_layer.objects.active = curve_obj
        bpy.ops.object.modifier_apply(modifier=mod.name)

    return curve_obj


def unwrap_uv_no_bounds(obj, image_path, pixels_per_unit=100.0):
    import bmesh
    import bpy
    import mathutils
    from PIL import Image

    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')

    bm = bmesh.from_edit_mesh(obj.data)
    uv_layer = bm.loops.layers.uv.verify()
    bm.faces.ensure_lookup_table()

    image_width, image_height = Image.open(image_path).size

    for face in bm.faces:
        for loop in face.loops:
            co = loop.vert.co
            u = (co.x / (image_width / pixels_per_unit))
            v = 1 - (co.y / (image_height / pixels_per_unit))
            loop[uv_layer].uv = mathutils.Vector((u, v))

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode='OBJECT')


def center_object_origin(obj):
    import mathutils

    # Switch to object mode
    bpy.ops.object.mode_set(mode='OBJECT')

    # Compute local bounding box center
    verts = obj.data.vertices
    if not verts:
        return

    min_corner = mathutils.Vector((min(v.co.x for v in verts),
                                   min(v.co.y for v in verts),
                                   min(v.co.z for v in verts)))
    max_corner = mathutils.Vector((max(v.co.x for v in verts),
                                   max(v.co.y for v in verts),
                                   max(v.co.z for v in verts)))
    center = (min_corner + max_corner) * 0.5

    # Move vertices so object is centered
    for v in verts:
        v.co -= center

    # Move object to where center used to be
    obj.location += center


def get_extended_image(img, fill_width=50, min_alpha=227):
    import numpy as np
    from PIL import Image
    original_np = np.array(img).astype(np.float32)
    height, width, _ = original_np.shape
    edge_margin = int(fill_width * 4)

    def composite_over_black(pixel):
        r, g, b, a = pixel / 255.0
        return np.array([r * a * 255, g * a * 255, b * a * 255, 255], dtype=np.float32)

    # --- Vertical Fill ---
    for x in range(edge_margin, width - edge_margin):
        alpha_col = original_np[:, x, 3]
        visible_indices = np.where(alpha_col >= min_alpha)[0]
        if len(visible_indices) >= 4:
            top_idx = visible_indices[3]
            bottom_idx = visible_indices[-4]
            top_pixel = composite_over_black(original_np[top_idx, x])
            bottom_pixel = composite_over_black(original_np[bottom_idx, x])

            for y in range(max(0, top_idx - fill_width), top_idx):
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = top_pixel

            for y in range(bottom_idx + 1, min(height, bottom_idx + fill_width + 1)):
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = bottom_pixel

    # --- Horizontal Fill ---
    edge_margin_h = int(edge_margin / 12)
    for y in range(edge_margin_h, height - edge_margin_h):
        row = original_np[y]
        alpha = row[:, 3]
        visible_indices = np.where(alpha >= min_alpha)[0]
        if len(visible_indices) >= 4:
            left_idx = visible_indices[3]
            right_idx = visible_indices[-4]
            left_pixel = composite_over_black(row[left_idx])
            right_pixel = composite_over_black(row[right_idx])

            for x in range(max(edge_margin_h, left_idx - fill_width), left_idx):
                if x >= width - edge_margin_h:
                    continue
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = left_pixel

            for x in range(right_idx + 1, min(width - edge_margin_h, right_idx + fill_width + 1)):
                if x < edge_margin_h:
                    continue
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = right_pixel

    result_img = Image.fromarray(
        np.clip(original_np, 0, 255).astype(np.uint8), "RGBA")
    return result_img


def contour_to_mesh(image_path, simplicity=3.0, threshold=0.1, extrude_depth=0.2, pixels_per_unit=100.0):
    from skimage import measure
    from PIL import Image
    import numpy as np
    import bpy
    import bmesh
    import cv2
    import mathutils

    img = Image.open(image_path).convert("RGBA")
    alpha = np.array(img)[:, :, 3] / 255.0
    mask = alpha > threshold
    mask = np.pad(mask, pad_width=1, mode='constant', constant_values=False)

    raw_contours = measure.find_contours(mask, 0.8)
    raw_contours = sorted(raw_contours, key=len, reverse=True)
    if not raw_contours:
        print("No contours found.")
        return None

    contour = raw_contours[0]
    contour = contour.astype(np.float32).reshape((-1, 1, 2))
    approx = cv2.approxPolyDP(contour, simplicity, True).reshape(-1, 2)

    if len(approx) < 3:
        print("Contour too small")
        return None

    # Build mesh from scratch
    mesh = bpy.data.meshes.new("GeneratedMesh")
    obj = bpy.data.objects.new("GeneratedObject", mesh)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)

    bm = bmesh.new()

    top_verts = []
    for pt in approx:
        x = pt[1] / pixels_per_unit
        y = pt[0] / pixels_per_unit
        top_verts.append(bm.verts.new((x, y, 0)))

    bmesh.ops.contextual_create(bm, geom=top_verts)

    # Duplicate bottom ring
    bottom_verts = [bm.verts.new(
        (v.co.x, v.co.y, -extrude_depth)) for v in top_verts]

    # Bridge side faces
    for i in range(len(top_verts)):
        v_top1 = top_verts[i]
        v_top2 = top_verts[(i + 1) % len(top_verts)]
        v_bot1 = bottom_verts[i]
        v_bot2 = bottom_verts[(i + 1) % len(bottom_verts)]

        bm.faces.new([v_top1, v_top2, v_bot2, v_bot1])

    # Fill bottom
    bmesh.ops.contextual_create(bm, geom=bottom_verts)

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()

    return obj


def apply_image_material(obj, image_path):
    from PIL import Image
    mat = bpy.data.materials.new(name="ImageMaterial")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    tex_image = mat.node_tree.nodes.new('ShaderNodeTexImage')
    original_img = Image.open(image_path).convert("RGBA")
    width, height = original_img.size
    pad = int(width * 0.01)
    new_width = width + 2 * pad
    extended_img = get_extended_image(original_img)
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        extended_path = tmp.name
        extended_img.save(extended_path)
    img = bpy.data.images.load(extended_path)
    tex_image.image = img
    tex_image.projection = 'FLAT'
    tex_image.extension = 'CLIP'
    mat.node_tree.links.new(
        bsdf.inputs['Base Color'], tex_image.outputs['Color'])
    obj.data.materials.append(mat)


class OBJECT_OT_ImageToMesh(Operator, ImportHelper):
    bl_idname = "object.image_to_mesh"
    bl_label = "Image to Mesh"
    bl_description = "Convert transparent image to fully enclosed 3D mesh"
    bl_options = {'REGISTER', 'UNDO'}
    filename_ext = ".png"
    filter_glob: StringProperty(default="*.png", options={'HIDDEN'})
    extrude_depth: FloatProperty(
        name="Extrude Depth", default=0.2, min=0.01, max=10.0)
    simplicity: FloatProperty(
        name="Simplicity", default=3.0, min=0.01, max=10.0)
    min_length: FloatProperty(
        name="Minimum Length", default=2000.0, min=1.0, max=10000.0)
    enclosed: BoolProperty(
        name="Enclosed / 3D Printable", default=False)
    rounded: BoolProperty(
        name="Rounded Edges", default=False)

    def execute(self, context):
        import math
        settings = context.window_manager.image_to_mesh_settings
        self.extrude_depth = settings.extrude_depth
        self.simplicity = settings.simplicity
        self.enclosed = settings.enclosed
        self.rounded = settings.rounded
        self.min_length = settings.min_length

        curves = [1]
        mesh_obj = 0

        if self.enclosed:
            mesh_obj = contour_to_mesh(
                self.filepath, .5, 0.1, self.extrude_depth)
        else:
            curves = image_to_outer_curve_arr(
                self.filepath, self.simplicity, self.min_length)

        for curve in curves:
            if not self.enclosed:
                mesh_obj = curve_to_mesh(curve, self.extrude_depth)
            if self.rounded:
                mesh_obj = curve_to_mesh_rounded(curve, self.extrude_depth)

            unwrap_uv_no_bounds(mesh_obj, self.filepath)
            apply_image_material(mesh_obj, self.filepath)

            if len(curves) == 1:
                center_object_origin(mesh_obj)  # ✅ center here
                mesh_obj.location = (0, 0, 0)   # ✅ move to world origin

            mesh_obj.rotation_euler[2] += math.radians(180)
            bpy.context.view_layer.objects.active = mesh_obj
            mesh_obj.select_set(True)
            bpy.ops.object.transform_apply(rotation=True)
            mesh_obj.scale[0] *= -1
            bpy.ops.object.transform_apply(scale=True)

            bpy.ops.object.mode_set(mode='EDIT')
            bpy.ops.mesh.select_all(action='SELECT')
            bpy.ops.mesh.normals_make_consistent(inside=False)
            bpy.ops.object.mode_set(mode='OBJECT')
        return {"FINISHED"}


class OBJECT_PT_ImageToMeshPanel(Panel):
    bl_label = "Image to Mesh"
    bl_idname = "OBJECT_PT_image_to_mesh"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Create'

    def draw(self, context):
        global install_triggered
        layout = self.layout

        if not install_triggered:
            install_triggered = True
            layout.label(text="🔄 Installing dependencies...")
            bpy.app.timers.register(trigger_install_later)
            return

        layout.prop(context.window_manager.image_to_mesh_settings,
                    'extrude_depth')
        layout.prop(context.window_manager.image_to_mesh_settings,
                    'simplicity')
        layout.prop(context.window_manager.image_to_mesh_settings,
                    'min_length')
        layout.prop(context.window_manager.image_to_mesh_settings,
                    'enclosed')
        layout.prop(context.window_manager.image_to_mesh_settings,
                    'rounded')
        layout.operator(OBJECT_OT_ImageToMesh.bl_idname)


class ImageToMeshSettings(bpy.types.PropertyGroup):
    extrude_depth: FloatProperty(
        name="Extrude Depth", default=0.2, min=0.01, max=10.0)
    simplicity: FloatProperty(
        name="Simplicity", default=3.0, min=0.01, max=10.0)
    min_length: FloatProperty(
        name="Minimum Length", default=2000.0, min=1.0, max=10000.0)
    enclosed: BoolProperty(
        name="Enclosed / 3D Printable", default=False)
    rounded: BoolProperty(
        name="Rounded Edges", default=False)


classes = (
    MESSAGEBOX_OT_simple,
    INSTALL_OT_modal,
    OBJECT_OT_ImageToMesh,
    OBJECT_PT_ImageToMeshPanel,
    ImageToMeshSettings,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.WindowManager.image_to_mesh_settings = PointerProperty(
        type=ImageToMeshSettings)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
    del bpy.types.WindowManager.image_to_mesh_settings


if __name__ == "__main__":
    if not bpy.app.background:
        register()


def install_packages_headless():
    try:
        subprocess.check_call([sys.executable, "-m", "ensurepip"])
    except Exception:
        pass

    for module, package in REQUIRED_PACKAGES.items():
        try:
            __import__(module)
        except ImportError:
            try:
                print(f"[Dependency] Installing {package}...")
                subprocess.check_call(
                    [sys.executable, "-m", "pip", "install", package])
            except Exception as e:
                print(f"[Dependency ERROR] Failed to install {package}: {e}")
                sys.exit(1)


def run_headless():
    install_packages_headless()

    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    parser = argparse.ArgumentParser(
        description="Generate 3D mesh from image.")
    parser.add_argument("--image", required=True, help="Path to input image")
    parser.add_argument("--extrude", type=float,
                        default=0.2, help="Extrude depth")
    parser.add_argument("--simplicity", type=float,
                        default=3.0, help="Contour simplification")
    parser.add_argument("--enclosed", action="store_true",
                        help="Generate enclosed mesh")
    parser.add_argument("--rounded", action="store_true",
                        help="Use rounded bevel on extrusion")
    parser.add_argument("--filetype", default="obj",
                        help="Select a file type: OBJ / FBX / GLTF")
    parser.add_argument("--min_length", default=2000.0,
                        help="Minimum Length of a Generated Object")

    args = parser.parse_args(argv)
    type = args.filetype.lower()
    output = args.image.replace(".png", "." + type)

    curves = [1]
    mesh_obj = 0

    if args.enclosed:
        mesh_obj = contour_to_mesh(
            args.image, .5, 0.1, args.extrude)
    else:
        curves = image_to_outer_curve_arr(
            args.image, args.simplicity, args.min_length)

    for curve in curves:
        if not args.enclosed:
            mesh_obj = curve_to_mesh(curve, args.extrude)
        if args.rounded:
            mesh_obj = curve_to_mesh_rounded(curve, args.extrude)

        unwrap_uv_no_bounds(mesh_obj, args.image)
        apply_image_material(mesh_obj, args.image)

        if len(curves) == 1:
            center_object_origin(mesh_obj)  # ✅ center here
            mesh_obj.location = (0, 0, 0)   # ✅ move to world origin

        bpy.ops.object.select_all(action='DESELECT')
        mesh_obj.select_set(True)
        bpy.context.view_layer.objects.active = mesh_obj

        import math
        mesh_obj.rotation_euler[2] += math.radians(180)
        bpy.ops.object.transform_apply(rotation=True)
        mesh_obj.scale[0] *= -1
        bpy.ops.object.transform_apply(scale=True)

        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')

    cube = bpy.data.objects.get("Cube")
    if cube:
        bpy.data.objects.remove(cube, do_unlink=True)
    bpy.ops.object.select_all(action='SELECT')
    # Export OBJ
    if type == "obj":
        bpy.ops.wm.obj_export(filepath=output,
                              export_selected_objects=True)
    elif type == "fbx":
        bpy.ops.export_scene.fbx(
            filepath=output, use_selection=True, path_mode="COPY", embed_textures=True)
    elif type == "gltf":
        bpy.ops.export_scene.gltf(
            filepath=output, use_selection=True)


if bpy.app.background:
    run_headless()
