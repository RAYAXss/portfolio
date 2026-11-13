import type { Flow } from './flow';

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  whyUse: string;
  usage: string;
  example: string;
  icon: string;
  flow: Flow;
}
