# Public Asset Research for Chibundu Awandu

Reviewed September 12, 2026. This is research, not a deployed design or a claim that these devices were built by Chibundu.

Implementation update: the user selected this collection. The car and three robots are now converted into local, independently inspectable exhibits; the rack and motherboard remain credited previews pending signed-in model downloads. The proposals and pre-conversion figures below are the original research snapshot. See [current model notes](MODEL_NOTES.md) for the implemented scope and provenance.

## Recommendation

Choose an object that explains the work rather than borrowing unrelated prestige. The supplied June 2026 resume has three strong narratives: production GenAI/distributed services at Apple; infrastructure security and recovery at Splunk; and ADAS/YOLO/ROS 2 at EcoCar. Quantitative projects should use clearly labeled simulated market visualizations, not invented live returns.

My recommended main experience is a **concept vehicle with a perception mode**, supported by a compact systems/data-flow view for Apple and Splunk. It is the most direct connection to an actual project and the most immediately usable web asset. If a less automotive, more sculptural identity is preferred, choose the **Shadow robotic hand**. A **Go2 quadruped** offers the strongest animated personality but needs more conversion work.

These are design judgments. File structure and licensing findings below are verified separately from those judgments. No asset has been converted or benchmarked in the portfolio yet.

## 1. CarConcept: Best Direct Resume Connection

- Source: [Khronos CarConcept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept), adapted by Eric Chadwick / Darmstadt Graphics Group.
- [Preview](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/screenshot/screenshot_Large.jpg).
- License: model/textures CC BY 4.0. The included Khronos/3D Commerce marks have separate trademark notices. Preserve attribution and avoid implying endorsement.
- Verified structure: the glTF has 101 nodes and 97 meshes, including wheel groups, doors, hood, roof, seats and an engine. Named hierarchy and usable pivots are documented by the author. This is NOT an EV engineering model or a replica of the EcoCar prototype.
- Delivery: native glTF/GLB, approximately 10 MB depending on variant. Needs mobile optimization and selective material simplification. The author documents multiple compression variants.
- Proposed experience: low three-quarter camera on a long architectural platform; restrained metallic finish; open the panels; toggle a clearly labeled illustrative perception overlay with pedestrian boxes and lane traces. Place the actual EcoCar story beside it.
- Explosion boundary: separate supplied panels, wheels and cabin assemblies. Do not promise a complete powertrain or battery teardown; small hidden mechanical details were deliberately removed upstream.

## 2. Shadow Hand: Most Distinctive Sculptural Option

- Source: [Shadow Hand E3M5](https://github.com/google-deepmind/mujoco_menagerie/tree/main/shadow_hand), with original assets supplied by Shadow Robot Company.
- [Preview](https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/main/shadow_hand/shadow_hand.png).
- License: [Apache-2.0](https://github.com/google-deepmind/mujoco_menagerie/blob/main/shadow_hand/LICENSE).
- Verified structure: the right-hand MJCF names 25 bodies and 24 joints, covering the forearm, wrist, palm and finger links. The assets directory is about 3.50 MB before conversion, not a final web payload.
- Resume relationship: a thematic bridge to AI, C++/ROS 2, interfaces and control; the resume does not claim dexterous-hand research.
- Proposed experience: upright graphite hand under a narrow warm key light; subtle fingertip motion; finger groups spread into an atlas when explored; individual joints illuminate as software concepts are explained.
- Explosion boundary: articulated link-level inspection is well supported. Internal tendons, motors and electronics are not guaranteed to be modeled. MJCF/OBJ conversion and retained joint transforms are required; running a full physics engine is optional, not necessary for the site.

## 3. Unitree Go2: Best Animated Hero

- Source: [Unitree Go2 in MuJoCo Menagerie](https://github.com/google-deepmind/mujoco_menagerie/tree/main/unitree_go2), derived from Unitree's public robot description.
- [Preview](https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/main/unitree_go2/go2.png).
- License: [BSD-3-Clause](https://github.com/google-deepmind/mujoco_menagerie/blob/main/unitree_go2/LICENSE).
- Verified structure: the main model has 13 named bodies (base plus hip/thigh/calf on four legs), 12 named joints and 16 mesh references. Source assets total about 28.41 MB before optimization.
- Resume relationship: computer vision, autonomous systems, ROS 2 and robust software. It is an illustrative platform, not a robot Chibundu claims to have worked on.
- Proposed experience: the robot turns toward the visitor, walks onto a platform, and pauses. A toggle separates the base and leg assemblies; a second mode reveals an illustrative sensing-to-inference-to-action flow.
- Explosion boundary: link assemblies are available; the sensor housing and electronics should not be advertised as a full internal teardown. Convert and compress before browser delivery. Source directory megabytes are not a predicted GLB download size.

## 4. Server Rack: Best Apple/Splunk Story

- Source: [Server Rack by Shalmon](https://sketchfab.com/3d-models/server-rack-c144d837358d446998c7b63cd1bdf825).
- License: CC BY 4.0, confirmed through the [Sketchfab model API](https://api.sketchfab.com/v3/models/c144d837358d446998c7b63cd1bdf825). Credit Shalmon even though the description informally says credit is optional.
- Verified metadata: downloadable, 74,823 triangles and 41,233 vertices. Original archive size, hierarchy and separate hardware internals are not yet verified. Browser page retrieval was restricted; the public API supplied current metadata.
- Resume relationship: the strongest literal asset for Java/WebFlux services, MongoDB, multi-pod work claiming, circuit breaking, credential protection and configuration recovery.
- Proposed experience: rack modules become labeled service nodes. A visitor triggers a simulated pod failure, sees traffic reroute, and opens a trace explaining the engineering decision. This demonstrates software more convincingly than a purely decorative explosion.
- Human involvement: a Sketchfab sign-in/download may be needed. Inspect the downloaded hierarchy before promising removable blades, boards or cooling assemblies.

## 5. Franka Panda: Best Functional Interaction

- Source: [Franka Emika Panda](https://github.com/google-deepmind/mujoco_menagerie/tree/main/franka_emika_panda), derived from the public Franka ROS description.
- [Preview](https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/main/franka_emika_panda/panda.png).
- License: [Apache-2.0](https://github.com/google-deepmind/mujoco_menagerie/blob/main/franka_emika_panda/LICENSE).
- Verified structure: the main MJCF has 11 named bodies, seven arm joints and two finger joints. Its 67 mesh source files total about 34.29 MB; some are collision geometry, not distinct manufactured parts.
- Resume relationship: AI/control/ROS 2 themes rather than a named resume project.
- Proposed experience: the arm picks up an object associated with a project, places it on a stage, then separates into link assemblies for inspection. This gives the visitor a purposeful interaction rather than another spinning model.
- Constraints: requires conversion and optimization. The source supports links and gripper geometry, not a complete gearbox-level teardown.

## 6. Motherboard: Best Supporting Detail Asset

- Source: [Mother Board 3d Model by ARComputerFundamentals](https://sketchfab.com/3d-models/mother-board-3d-model-99a5f94e130a41c48590d59877f08663).
- License: CC BY 4.0, confirmed through the [Sketchfab model API](https://api.sketchfab.com/v3/models/99a5f94e130a41c48590d59877f08663).
- Verified metadata: downloadable, 41,066 triangles and 22,297 vertices. Separate meshes, archive size and chip-level labeling remain unverified.
- Resume relationship: Computer Engineering degree plus backend/AI infrastructure. This is a generic motherboard, not verified Apple hardware or an AI accelerator.
- Proposed experience: a macro camera move across a floating board, with processing, memory and I/O used as explicitly conceptual entry points into projects. Better as a supporting scene than the whole website.
- Human involvement: possible Sketchfab sign-in; inspect the actual download before planning lift-off chips, RAM or cooling modules.

## Screened Out

- **Skydio X2**: [the official contributed model](https://github.com/google-deepmind/mujoco_menagerie/tree/main/skydio_x2) is Apache-2.0 and compact, but the provided assets have one OBJ mesh and the description has no articulated degrees of freedom. Good for a fly-through, weak for the requested part-level explosion without further authoring.
- **Another telescope/camera/watch**: technically interesting, but weaker links to the supplied resume than computing, robotics or a vehicle. Do not mistake visual complexity for relevant storytelling.
- **Decorative stock trading floor**: less convincing than an original order-book/replay visualization tied to the supplied simulated strategy results. No live-market or real-profit implication.

## Build Gates

1. Select one main object from the visual shortlist before a major rebuild.
2. Retain original licenses/credits, record a pinned source revision, and label imported asset authorship separately from Chibundu's website work.
3. Inspect the actual geometry and map only supplied mesh assemblies to the explode controls. Label custom internals and perception overlays as illustrative.
4. Convert once at build time, compress geometry/textures, preserve useful hierarchy and remove collision-only duplicates. Do not ship simulator packages just to display a model.
5. Benchmark on desktop and mobile before choosing final texture sizes, shadow quality and model detail. No measured FPS or payload guarantee is claimed in this research.
6. Present a local assembled/exploded preview before committing to the production redesign. This research does not publish any changes.
