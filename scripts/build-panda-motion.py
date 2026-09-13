"""Export the licensed Panda visual hierarchy and a joint-limited kinematic study.

No physics, collision avoidance, or hardware controller is implied by this clip.
"""
from pathlib import Path
import json
import mujoco
import numpy as np
import trimesh

root = Path('test-artifacts/source-assets')
model = mujoco.MjModel.from_xml_path(str(root / 'franka_emika_panda/panda.xml'))
data = mujoco.MjData(model)
mujoco.mj_resetDataKeyframe(model, data, 0)
mujoco.mj_forward(model, data)
hand = model.body('hand').id
rotation = data.xmat[hand].reshape(3, 3).copy()
home = data.qpos.copy()
conversion = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]])

def pose(body):
    matrix = np.eye(4)
    matrix[:3, :3] = conversion @ data.xmat[body].reshape(3, 3) @ conversion.T
    matrix[:3, 3] = conversion @ data.xpos[body]
    return matrix

scene = trimesh.Scene()
for body in range(1, model.nbody):
    parent = int(model.body_parentid[body])
    local = np.linalg.inv(pose(parent)) @ pose(body)
    scene.graph.update(frame_to=model.body(body).name,
                       frame_from=model.body(parent).name, matrix=local)
for i in range(model.ngeom):
    if model.geom_group[i] != 2 or model.geom_type[i] != mujoco.mjtGeom.mjGEOM_MESH:
        continue
    mesh_id = model.geom_dataid[i]
    a, n = model.mesh_vertadr[mesh_id], model.mesh_vertnum[mesh_id]
    b, count = model.mesh_faceadr[mesh_id], model.mesh_facenum[mesh_id]
    vertices = model.mesh_vert[a:a+n] @ data.geom_xmat[i].reshape(3, 3).T + data.geom_xpos[i]
    body = int(model.geom_bodyid[i])
    vertices = trimesh.transform_points(vertices @ conversion.T, np.linalg.inv(pose(body)))
    mesh = trimesh.Trimesh(vertices, model.mesh_face[b:b+count], process=False)
    mat_id = int(model.geom_matid[i])
    rgba = model.mat_rgba[mat_id] if mat_id >= 0 else model.geom_rgba[i]
    mesh.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
        name=f'material_{mat_id}', baseColorFactor=np.clip(rgba * 255, 0, 255).astype(np.uint8),
        metallicFactor=.2, roughnessFactor=.38))
    scene.add_geometry(mesh, node_name=f'visual_{i}', parent_node_name=model.body(body).name)
(root / 'panda-rig.glb').write_bytes(trimesh.exchange.gltf.export_glb(scene))

def solve(target, fingers):
    # Damped least-squares IK: preserve the source home wrist orientation.
    jp, jr = np.zeros((3, model.nv)), np.zeros((3, model.nv))
    for _ in range(400):
        mujoco.mj_forward(model, data)
        current = data.xmat[hand].reshape(3, 3)
        error = np.concatenate([target-data.xpos[hand], sum(np.cross(current[:, i], rotation[:, i]) for i in range(3))*.5])
        if np.linalg.norm(error) < 1e-5:
            break
        mujoco.mj_jacBody(model, data, jp, jr, hand)
        jac = np.vstack([jp[:, :7], jr[:, :7]])
        step = jac.T @ np.linalg.solve(jac @ jac.T + np.eye(6)*.002, error)
        data.qpos[:7] = np.clip(data.qpos[:7]+np.clip(step, -.08, .08), model.jnt_range[:7, 0]+.001, model.jnt_range[:7, 1]-.001)
    data.qpos[7:] = fingers
    mujoco.mj_forward(model, data)
    assert np.linalg.norm(target-data.xpos[hand]) < .003, 'IK target not reached'
    return data.qpos.copy()

pick = np.array([.45, -.22, .25])
place = np.array([.45, .22, .25])
keys = [(0, home.copy())]
for t, target, fingers in [(1.4, pick+[0,0,.22], .04), (2.4, pick, .04), (3, pick, .012),
                           (4, pick+[0,0,.25], .012), (5.4, place+[0,0,.25], .012),
                           (6.4, place, .012), (7, place, .04), (8, place+[0,0,.22], .04)]:
    keys.append((t, solve(target, fingers)))
keys.append((9.5, home.copy()))
tracks = {model.body(i).name: {'position': [], 'quaternion': []} for i in range(1, model.nbody)}
times = np.linspace(0, 9.5, 115)
for t in times:
    index = min(next((i for i in range(len(keys)-1) if keys[i][0] <= t <= keys[i+1][0]), len(keys)-2), len(keys)-2)
    ta, qa = keys[index]; tb, qb = keys[index+1]
    s = (t-ta)/(tb-ta); s = s*s*(3-2*s)
    data.qpos[:] = qa*(1-s)+qb*s
    mujoco.mj_forward(model, data)
    for body in range(1, model.nbody):
        local = np.linalg.inv(pose(int(model.body_parentid[body]))) @ pose(body)
        quaternion = trimesh.transformations.quaternion_from_matrix(local)
        track = tracks[model.body(body).name]
        q = quaternion[[1,2,3,0]]
        if track['quaternion'] and np.dot(track['quaternion'][-4:], q) < 0:
            q = -q
        track['position'].extend(local[:3,3].round(7).tolist())
        track['quaternion'].extend(q.round(7).tolist())
(root / 'panda-motion.json').write_text(json.dumps({'times': times.round(5).tolist(), 'tracks': tracks}))
print('Exported 11 source body transforms, 9.5-second joint-limited pick/place study.')
