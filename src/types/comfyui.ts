import type { Flow } from './flow';

export type WorkflowId = 't2i' | 'i2v' | 'i3d';

export interface ComfyUIWorkflow {
  id: WorkflowId;
  title: string;
  tagline: string;
  io: string;
  features: string[];
  techStack: string[];
  icon: string;
  flow: Flow;
}
