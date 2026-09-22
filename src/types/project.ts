export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  /** Emoji affiché quand le projet n'a pas d'image de preview. */
  icon?: string;
  status?: string;
  links: {
    github?: string;
    live?: string;
    external?: string;
  };
}
