export type ProjectCategory = 'cyber' | 'dev' | 'engineering';

/** Type de lien : décide du libellé et de l'icône affichés. */
export type ProjectLinkKind = 'code' | 'demo' | 'report' | 'profile';

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
}

export interface Project {
  /** Identifiant stable (slug), aussi utilisé comme ancre. */
  id: string;
  title: string;
  /** Une phrase, visible sans ouvrir le projet. */
  summary: string;
  /** Paragraphe affiché à l'ouverture. */
  description: string;
  /** Ce que j'ai fait concrètement (liste courte). */
  highlights: string[];
  /** Cadre du projet : "Projet personnel", "EPF, M1 (S2)"… */
  context: string;
  category: ProjectCategory;
  techStack: string[];
  /** Captures, la première sert de miniature. Chemins sous public/. */
  images: string[];
  status?: string;
  /** Liens utiles : code, démo à tester, rapport/mémoire (PDF sous public/docs/projects/), profil. */
  links: ProjectLink[];
}
