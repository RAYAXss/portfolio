export interface WorkflowNode {
  id: string;
  label: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: [string, string][];
}

export interface ComfyUIWorkflow {
  id: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  icon: string;
  graph: WorkflowGraph;
}
