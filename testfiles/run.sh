Blender --background --python ../imageToMeshPlugin.py -- \
    --image "burger.png" \
    --extrude 0.2 \
    --simplicity 3 \
    --filetype "gltf" \
    --minlength 200 \
    --rounded
    #--enclosed \
    #--rounded \