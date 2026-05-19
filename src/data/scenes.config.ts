export type SectionId =
  | 'lab'
  | 'engineer'
  | 'ai-systems'
  | 'markets'
  | 'vision'
  | 'connect';

export type SceneAnchor = {
  id: SectionId;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  world: [number, number, number];
  camera: [number, number, number];
  target: [number, number, number];
};

export const resumeHref = '/Chibundu_Awandu_2026_Resume.pdf';

export const sceneAnchors: SceneAnchor[] = [
  {
    id: 'lab',
    navLabel: 'Lab',
    eyebrow: 'Scene 01',
    title: 'The Lab Entrance',
    description: 'An atmospheric front door into AI systems, markets, and vision work.',
    world: [0, 0, 0],
    camera: [0, 1.6, 14],
    target: [0, 1.5, 0]
  },
  {
    id: 'engineer',
    navLabel: 'Engineer',
    eyebrow: 'Scene 02',
    title: 'The Engineer',
    description: 'Background, stack, and operating philosophy.',
    world: [22, 0, 0],
    camera: [22, 2.4, 13],
    target: [22, 1.6, 0]
  },
  {
    id: 'ai-systems',
    navLabel: 'AI Systems',
    eyebrow: 'Scene 03',
    title: 'AI & ML Systems',
    description: 'Inference pipelines, monitoring loops, and platform readiness.',
    world: [46, 0, 0],
    camera: [46, 4, 15],
    target: [46, 1.4, 0]
  },
  {
    id: 'markets',
    navLabel: 'Markets',
    eyebrow: 'Scene 04',
    title: 'Market Lab',
    description: 'Quant ideas, order-book motion, and signal-driven experimentation.',
    world: [72, 0, 0],
    camera: [72, 4.6, 16],
    target: [72, 0.8, 0]
  },
  {
    id: 'vision',
    navLabel: 'Vision',
    eyebrow: 'Scene 05',
    title: 'Vision & Autonomy',
    description: 'Perception overlays, lane logic, and real-time detection.',
    world: [98, 0, 0],
    camera: [98, 8, 13],
    target: [98, 0, 0]
  },
  {
    id: 'connect',
    navLabel: 'Connect',
    eyebrow: 'Scene 06',
    title: 'Connect',
    description: 'A clean signal beacon for opportunities and collaboration.',
    world: [124, 0, 0],
    camera: [124, 2.8, 12],
    target: [124, 1.2, 0]
  }
];

export const sectionOrder = sceneAnchors.map((scene) => scene.id);

export const getSceneAnchor = (sectionId: SectionId) =>
  sceneAnchors.find((scene) => scene.id === sectionId) ?? sceneAnchors[0];
