export interface ExperienceType {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  responsibilities: string[];
}

export interface EducationType {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface ProjectType {
  id: number;
  title: string;
  category: string;
  image: string;
  summary: string;
  period: string;
  team: string;
  description: string;
  outcomes: string[];
}

export interface SkillType {
  name: string;
  level: number;
  category: 'technical' | 'healthcare' | 'soft' | 'mecanical'|'langue';
}