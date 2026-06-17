export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  status?: string;
  links: {
    github?: string;
    live?: string;
    external?: string;
  };
}
