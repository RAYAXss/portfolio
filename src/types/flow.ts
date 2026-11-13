export type WireType = 'MODEL' | 'CLIP' | 'VAE' | 'CONDITIONING' | 'LATENT' | 'IMAGE' | 'VIDEO' | 'MESH';

export type FlowNodeKind = 'input' | 'loader' | 'text' | 'latent' | 'sampler' | 'decode' | 'post' | 'output';

export interface FlowParam {
  name: string;
  value: string;
  explain: string;
}

export interface FlowNode {
  id: string;
  label: string;
  kind: FlowNodeKind;
  col: number;
  row: number;
  summary: string;
  detail: string;
  params?: FlowParam[];
}

/** `type` absent = câble neutre (NOISE, SAMPLER, SIGMAS, GUIDER, audio, étapes de skill). */
export interface FlowEdge {
  from: string;
  to: string;
  type?: WireType;
}

export interface Flow {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
