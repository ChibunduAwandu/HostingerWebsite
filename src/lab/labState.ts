export type Chapter = 0 | 1 | 2;
export type Surface = "material" | "scan";
export const chapters = [
  {
    name: "Perceive",
    title: "Obstacle detection",
    body: "Move the amber obstacle into the lane. Compare the material and wireframe views to inspect the simulated detection boundary.",
    tag: "01 / Computer vision",
    connection: "EcoCar EV Challenge",
    proof: "C++ / ROS 2 / YOLO pedestrian tracking",
  },
  {
    name: "Process",
    title: "Request routing",
    body: "Follow a request through the system. Take a worker offline and watch the healthy paths carry the load.",
    tag: "02 / Distributed systems",
    connection: "Apple / Splunk",
    proof: "Streaming APIs / atomic claims / resilient infrastructure",
  },
  {
    name: "Act",
    title: "Coordinated motion",
    body: "Inspect a robot's joint hierarchy through a pick-and-place animation. Scrub the timeline to examine each pose.",
    tag: "03 / Robot kinematics",
    connection: "Computer engineering foundations",
    proof: "Kinematic study / source joints / not a hardware controller",
  },
] as const;
export const isObstructed = (position: number) => Math.abs(position) < 0.85;
export const workerShares = (failed: number | null) =>
  [0, 1, 2].map((i) => (failed === i ? 0 : failed === null ? 1 / 3 : 1 / 2));
export function actionPhase(progress: number) {
  if (progress < 2.4 / 9.5) return "Approaching";
  if (progress < 3 / 9.5) return "Grasping";
  if (progress < 6.4 / 9.5) return "Transferring";
  if (progress < 7 / 9.5) return "Releasing";
  if (progress < 1) return "Returning";
  return "Cycle complete";
}
