export type ExhibitId = "car" | "hand" | "go2" | "panda";
export type Part = { id: string; name: string; family: string };
export type Exhibit = {
  id: ExhibitId;
  number: string;
  name: string;
  subtitle: string;
  category: string;
  story: string;
  connection: string;
  credit: string;
  license: string;
  source: string;
  licenseUrl: string;
  size: string;
  parts: Part[];
};
const part = (id: string, name: string, family: string): Part => ({
  id,
  name,
  family,
});
export const exhibits: Exhibit[] = [
  {
    id: "car",
    number: "01",
    name: "Perception in motion.",
    subtitle: "Concept vehicle",
    category: "VISION / AUTONOMY",
    story:
      "A machine is only as capable as its understanding of the world. Look beneath the surface of this concept vehicle.",
    connection:
      "At EcoCar, I integrated ADAS with C++ and ROS 2 and developed YOLO-based pedestrian tracking. This public concept model illustrates the domain; it is not the EcoCar vehicle.",
    credit: "Eric Chadwick / Darmstadt Graphics Group",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source:
      "https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept",
    size: "3.21 MB",
    parts: [
      part("chassis", "Chassis & structural panels", "Structure"),
      part("roof", "Roof panel", "Bodywork"),
      part("windshield", "Windshield & wipers", "Bodywork"),
      part("hood", "Hood & headlights", "Bodywork"),
      part("rear", "Rear body & lighting", "Bodywork"),
      part("door-l", "Left door assembly", "Bodywork"),
      part("door-r", "Right door assembly", "Bodywork"),
      part("engine", "Engine assembly", "Powertrain"),
      part("axles", "Axles", "Powertrain"),
      part("cabin", "Cabin & seats", "Interior"),
      part("controls", "Steering & controls", "Interior"),
      part("wheel-fl", "Front left wheel & brake", "Running gear"),
      part("wheel-fr", "Front right wheel & brake", "Running gear"),
      part("wheel-rl", "Rear left wheel & brake", "Running gear"),
      part("wheel-rr", "Rear right wheel & brake", "Running gear"),
    ],
  },
  {
    id: "hand",
    number: "02",
    name: "Intelligence, embodied.",
    subtitle: "Shadow Dexterous Hand",
    category: "AI / EMBODIED SYSTEMS",
    story:
      "A study in dexterity. Many small interfaces, one coordinated system. Inspect the visual links of a robotic hand.",
    connection:
      "A visual bridge to my AI and computer-engineering background. This is an independent exploration of an open robotics asset, not a claim that I developed Shadow hardware.",
    credit: "Shadow Robot Company / MuJoCo Menagerie",
    license: "Apache 2.0",
    licenseUrl: "/licenses/shadow_hand.txt",
    source:
      "https://github.com/google-deepmind/mujoco_menagerie/tree/main/shadow_hand",
    size: "0.17 MB",
    parts: [
      part("rh_forearm", "Forearm housing", "Foundation"),
      part("rh_wrist", "Wrist link", "Foundation"),
      part("rh_palm", "Palm", "Foundation"),
      ...["ff", "mf", "rf", "lf"].flatMap((prefix, i) =>
        ["knuckle", "proximal", "middle", "distal"].map((link) =>
          part(
            `rh_${prefix}${link}`,
            `${["Index", "Middle", "Ring", "Little"][i]} / ${link}`,
            "Fingers",
          ),
        ),
      ),
      part("rh_lfmetacarpal", "Little / metacarpal", "Fingers"),
      ...["proximal", "middle", "distal"].map((link) =>
        part(`rh_th${link}`, `Thumb / ${link}`, "Thumb"),
      ),
    ],
  },
  {
    id: "go2",
    number: "03",
    name: "Balance meets logic.",
    subtitle: "Unitree Go2",
    category: "ROBOTICS / CONTROL",
    story:
      "Thirteen visual assemblies. Four legs. A compact lesson in how structure and control depend on each other.",
    connection:
      "Connects my ROS 2 and autonomy experience to an inspectable robotics study. The supplied model is shown in a reference pose; no live controller or physics simulation is running.",
    credit: "Unitree Robotics / MuJoCo Menagerie",
    license: "BSD 3-Clause",
    licenseUrl: "/licenses/unitree_go2.txt",
    source:
      "https://github.com/google-deepmind/mujoco_menagerie/tree/main/unitree_go2",
    size: "1.07 MB",
    parts: [
      part("base", "Body & sensor housing", "Foundation"),
      ...["FL", "FR", "RL", "RR"].flatMap((prefix, i) =>
        ["hip", "thigh", "calf"].map((link) =>
          part(
            `${prefix}_${link}`,
            `${["Front left", "Front right", "Rear left", "Rear right"][i]} / ${link}`,
            "Legs",
          ),
        ),
      ),
    ],
  },
  {
    id: "panda",
    number: "04",
    name: "Precision has layers.",
    subtitle: "Franka Emika Panda",
    category: "ENGINEERING / MANIPULATION",
    story:
      "Follow a chain of interfaces from the fixed base to the fingertips. Separate the real visual links and examine their relationships.",
    connection:
      "An engineering metaphor for the systems I build: well-defined interfaces, coordinated behavior, and a deliberate end result. This asset is not a personal hardware project.",
    credit: "Franka Emika / MuJoCo Menagerie",
    license: "Apache 2.0",
    licenseUrl: "/licenses/franka_emika_panda.txt",
    source:
      "https://github.com/google-deepmind/mujoco_menagerie/tree/main/franka_emika_panda",
    size: "0.51 MB",
    parts: [
      ...Array.from({ length: 8 }, (_, i) =>
        part(
          `link${i}`,
          i === 0 ? "Fixed base" : `Arm link ${i}`,
          i === 0 ? "Foundation" : "Arm",
        ),
      ),
      part("hand", "Gripper housing", "Gripper"),
      part("left_finger", "Left gripper finger", "Gripper"),
      part("right_finger", "Right gripper finger", "Gripper"),
    ],
  },
];

// Use source hierarchy, including unnamed tire meshes beneath their wheel nodes.
export function classifyPart(exhibit: ExhibitId, ancestors: string[]): string {
  if (exhibit !== "car")
    return ancestors.find((n) => n.includes("__"))?.split("__")[0] || "";
  const name = ancestors.join(" ");
  if (/WheelFrontL/.test(name)) return "wheel-fl";
  if (/WheelFrontR/.test(name)) return "wheel-fr";
  if (/WheelRearL/.test(name)) return "wheel-rl";
  if (/WheelRearR/.test(name)) return "wheel-rr";
  if (/BodyDoorL/.test(name)) return "door-l";
  if (/BodyDoorR/.test(name)) return "door-r";
  if (/BodyRoofPanel/.test(name)) return "roof";
  if (/BodyWindshield/.test(name)) return "windshield";
  if (/BodyHood/.test(name)) return "hood";
  if (/BodyRearPanels/.test(name)) return "rear";
  if (/Engine/.test(name)) return "engine";
  if (/Axles/.test(name)) return "axles";
  if (/InteriorSteering|InteriorDash|InteriorPedal/.test(name))
    return "controls";
  if (/Interior/.test(ancestors[0])) return "cabin";
  return "chassis";
}
