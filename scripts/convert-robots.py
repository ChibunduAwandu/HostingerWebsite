"""Bake only the supplied visual meshes in a documented pose, without a web physics runtime."""
from pathlib import Path
import json
import mujoco
import numpy as np
import trimesh

ROOT = Path('test-artifacts/source-assets')
MODELS = [('unitree_go2', 'go2.xml', 'go2'), ('shadow_hand', 'right_hand.xml', 'hand'), ('franka_emika_panda', 'panda.xml', 'panda')]
for folder, xml, name in MODELS:
    model = mujoco.MjModel.from_xml_path(str(ROOT / folder / xml))
    data = mujoco.MjData(model)
    if model.nkey and name in ('go2', 'panda'):
        mujoco.mj_resetDataKeyframe(model, data, 0)
    mujoco.mj_forward(model, data)
    scene = trimesh.Scene()
    material_cache = {}
    for i in range(model.ngeom):
        if model.geom_group[i] != 2 or model.geom_type[i] != mujoco.mjtGeom.mjGEOM_MESH:
            continue
        mesh_id = model.geom_dataid[i]
        start, length = model.mesh_vertadr[mesh_id], model.mesh_vertnum[mesh_id]
        fstart, flength = model.mesh_faceadr[mesh_id], model.mesh_facenum[mesh_id]
        vertices = model.mesh_vert[start:start + length].copy()
        faces = model.mesh_face[fstart:fstart + flength].copy()
        vertices = vertices @ data.geom_xmat[i].reshape(3, 3).T + data.geom_xpos[i]
        # MuJoCo is Z-up; the website uses Three.js Y-up.
        vertices = vertices[:, [0, 2, 1]] * [1, 1, -1]
        mat_id = int(model.geom_matid[i])
        rgba = model.mat_rgba[mat_id] if mat_id >= 0 else model.geom_rgba[i]
        if mat_id not in material_cache:
            mat_name = model.material(mat_id).name if mat_id >= 0 else 'default'
            material_cache[mat_id] = trimesh.visual.material.PBRMaterial(name=mat_name, baseColorFactor=np.clip(rgba * 255, 0, 255).astype(np.uint8), metallicFactor=.55 if 'metal' in mat_name else .12, roughnessFactor=.3 if 'metal' in mat_name else .48)
        mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
        mesh.visual = trimesh.visual.TextureVisuals(material=material_cache[mat_id])
        body = model.body(int(model.geom_bodyid[i])).name
        scene.add_geometry(mesh, node_name=f'{body}__{i}', geom_name=f'{body}__{i}')
    output = ROOT / f'{name}.glb'
    output.write_bytes(trimesh.exchange.gltf.export_glb(scene))
    print(json.dumps({'model': name, 'meshes': len(scene.geometry), 'bytes': output.stat().st_size, 'bounds': scene.bounds.tolist()}))
