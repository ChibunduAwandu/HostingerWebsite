export type PipelineNodeData = {
  id: string;
  title: string;
  blurb: string;
  position: [number, number, number];
  accent: string;
};

export const pipelineNodes: PipelineNodeData[] = [
  {
    id: 'ingest',
    title: 'Data Ingestion',
    blurb: 'Streaming inputs, validation gates, and resilient backend event intake.',
    position: [-9, 1.2, -1.1],
    accent: '#00D4FF'
  },
  {
    id: 'features',
    title: 'Feature Extraction',
    blurb: 'Structured metadata, quality checks, and enrichment before modeling.',
    position: [-6, 2.6, 0.9],
    accent: '#00FF94'
  },
  {
    id: 'embedding',
    title: 'NLP / Embedding Model',
    blurb:
      'Break Through Tech x Planned Parenthood style pipelines that turn conversation into analyzable signals.',
    position: [-2.7, 1.8, -0.5],
    accent: '#7B2FFF'
  },
  {
    id: 'inference',
    title: 'Inference Engine',
    blurb: 'Decision support primitives, runtime services, and low-latency orchestration.',
    position: [0.8, 3, 0.8],
    accent: '#00D4FF'
  },
  {
    id: 'output',
    title: 'Output Layer',
    blurb: 'Advisor-facing APIs, real-time streams, and structured downstream delivery.',
    position: [4.1, 1.6, -0.8],
    accent: '#FF6B35'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    blurb: 'Splunk-aware observability, resilience telemetry, and regression detection.',
    position: [7.5, 2.8, 1.1],
    accent: '#00FF94'
  },
  {
    id: 'feedback',
    title: 'Feedback Loop',
    blurb: 'Model retraining signals, human review, and continuous system hardening.',
    position: [10.4, 1.2, -0.3],
    accent: '#7B2FFF'
  }
];

export const pipelineEdges: Array<[string, string]> = [
  ['ingest', 'features'],
  ['features', 'embedding'],
  ['embedding', 'inference'],
  ['inference', 'output'],
  ['output', 'monitoring'],
  ['monitoring', 'feedback']
];
