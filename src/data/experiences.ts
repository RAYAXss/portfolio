import type { Language } from '../types/language';
import type { Experience } from '../types/experience';

type ExperienceText = Omit<Experience, 'start' | 'end'>;

// Dates machine (durée calculée à l'affichage), communes aux deux langues
const dates: Record<number, Pick<Experience, 'start' | 'end'>> = {
  5: { start: '2026-10' },
  1: { start: '2025-07', end: '2026-09' },
  2: { start: '2024-02', end: '2025-03' },
  3: { start: '2023-09', end: '2024-01' },
  4: { start: '2022-09', end: '2023-01' },
};

const experiencesFR: ExperienceText[] = [
  {
    id: 5,
    title: "Alternant Cybersécurité — Direction SSI",
    company: "SFR Business",
    location: "France",
    period: "Octobre 2026 - Aujourd'hui",
    contractType: "Alternance",
    description: "Alternance au sein de la direction Cybersécurité (SSI) de SFR Business : gouvernance, risques et conformité, sécurité dans les projets et suivi opérationnel.",
    responsibilities: [
      "GRC : gouvernance, gestion des risques et conformité du système d'information",
      "Conformité réglementaire et normative : NIS2, DORA, ISO 27001, ISO 27005",
      "Préparation et accompagnement de l'audit ISO 27001",
      "Intégration de la sécurité dans les projets et suivi opérationnel",
      "Création de dashboards et d'interfaces de suivi des projets et de la conformité",
      "Campagnes de sensibilisation à la cybersécurité"
    ]
  },
  {
    id: 1,
    title: "Ingénieur d'études PDA",
    company: "AMADEUS (EEKEM)",
    location: "Nice, France",
    period: "Juillet 2025 - Septembre 2026",
    contractType: "CDI",
    description: "Product Definition Analyst - Business/Data Analyst dans un environnement Big Data et cloud.",
    responsibilities: [
      "Exploitation d'environnements cloud (AWS EMR, Databricks) pour l'exécution, l'analyse et les tests de notebooks data",
      "Déclenchement et supervision de jobs via Jenkins dans un environnement Big Data",
      "Réalisation d'études de faisabilité, validation des prérequis techniques et refinement des évolutions produit",
      "Participation aux phases de qualification et validation technique avant mise en production",
      "Analyse des besoins métiers et rédaction de spécifications fonctionnelles et techniques",
      "Rédaction et maintien de la documentation fonctionnelle et technique",
      "Coordination transverse entre équipes DevOps, Produit et Data dans un contexte international",
      "Pilotage des cérémonies Agile (daily, rétrospectives, revues d'itération) en rôle de Scrum Master",
      "Formalisation des user stories, définition des critères d'acceptation et suivi des livrables sous Jira"
    ]
  },
  {
    id: 2,
    title: "Développeur Python",
    company: "ME3D Graft - Your Anastomosis",
    location: "Pécs, Hongrie",
    period: "Février 2024 - Mars 2025",
    contractType: "CDD",
    description: "Développement d'une application d'automatisation pour la reconstruction 3D et l'analyse d'images médicales.",
    responsibilities: [
      "Développement d'une application d'automatisation via Python (Tkinter, Pillow)",
      "Analyse d'images et reconstruction 3D",
      "Gestion Agile (backlog, user stories, sprints)",
      "Tests fonctionnels et maintenance corrective"
    ]
  },
  {
    id: 3,
    title: "Mission d'étude EPF",
    company: "AP-HP de Garches",
    location: "Garches, France",
    period: "Septembre 2023 - Janvier 2024",
    contractType: "Projet d'étude",
    description: "Exploiter l'IA pour développer un outil d'aide au diagnostic et au suivi des patients atteints d'AVC sur une base d'IRM.",
    responsibilities: [
      "Recueil des besoins auprès de radiologues/cliniciens, rédaction de spécifications",
      "Animation d'ateliers, formation et support utilisateurs",
      "Préparation de données DICOM, développement IA (segmentation TensorFlow)"
    ]
  },
  {
    id: 4,
    title: "Analyste Risques Cyber",
    company: "EQUANS",
    location: "Courbevoie, France",
    period: "Septembre 2022 - Janvier 2023",
    contractType: "Stage",
    description: "Participation à la construction des Dashboard Security et outils de Reporting des risques cyber.",
    responsibilities: [
      "Déploiement de campagnes de sensibilisation cyber (planning, supports, communication interne)",
      "Création de tableaux de bord Power BI pour suivi d'indicateurs de maturité sécurité",
      "Automatisation de workflows (Power Automate)",
      "Analyses de risques inter-BU (matrices impact/vraisemblance)"
    ]
  }
];

const experiencesEN: ExperienceText[] = [
  {
    id: 5,
    title: "Cybersecurity Work-Study — Information Security Department",
    company: "SFR Business",
    location: "France",
    period: "October 2026 - Present",
    contractType: "Work-study",
    description: "Work-study in the Cybersecurity (ISS) department of SFR Business: governance, risk and compliance, security in projects and operational follow-up.",
    responsibilities: [
      "GRC: governance, risk management and compliance of the information system",
      "Regulatory and standards compliance: NIS2, DORA, ISO 27001, ISO 27005",
      "ISO 27001 audit preparation and support",
      "Security by design in projects and operational follow-up",
      "Building dashboards and tracking interfaces for projects and compliance",
      "Cybersecurity awareness campaigns"
    ]
  },
  {
    id: 1,
    title: "Product Definition Analyst Engineer",
    company: "AMADEUS (EEKEM)",
    location: "Nice, France",
    period: "July 2025 - September 2026",
    contractType: "Full-time",
    description: "Product Definition Analyst - Business/Data Analyst in Big Data and cloud environment.",
    responsibilities: [
      "Cloud environment exploitation (AWS EMR, Databricks) for execution, analysis, and notebook data testing",
      "Trigger and supervise jobs via Jenkins in Big Data environment",
      "Feasibility studies, validation of technical prerequisites, and product evolution refinement",
      "Participate in qualification and technical validation phases before production",
      "Business needs analysis and functional/technical specifications writing",
      "Functional and technical documentation creation and maintenance",
      "Cross-team coordination between DevOps, Product, and Data in international context",
      "Lead Agile ceremonies (daily, retrospectives, iteration reviews) as Scrum Master",
      "User stories formalization, acceptance criteria definition, and Jira deliverables tracking"
    ]
  },
  {
    id: 2,
    title: "Python Developer",
    company: "ME3D Graft - Your Anastomosis",
    location: "Pécs, Hungary",
    period: "February 2024 - March 2025",
    contractType: "Fixed-term",
    description: "Development of automation application for 3D reconstruction and medical image analysis.",
    responsibilities: [
      "Automation application development via Python (Tkinter, Pillow)",
      "Image analysis and 3D reconstruction",
      "Agile management (backlog, user stories, sprints)",
      "Functional testing and corrective maintenance"
    ]
  },
  {
    id: 3,
    title: "Engineering Study Mission",
    company: "AP-HP Garches Hospital",
    location: "Garches, France",
    period: "September 2023 - January 2024",
    contractType: "Study Project",
    description: "Leverage AI to develop a diagnostic and patient follow-up tool for stroke patients using MRI data.",
    responsibilities: [
      "Requirements gathering from radiologists/clinicians, specifications writing",
      "Workshop facilitation, user training and support",
      "DICOM data preparation, AI development (TensorFlow segmentation)"
    ]
  },
  {
    id: 4,
    title: "Cyber Risk Analyst",
    company: "EQUANS",
    location: "Courbevoie, France",
    period: "September 2022 - January 2023",
    contractType: "Internship",
    description: "Contributing to Security Dashboard construction and cyber risk reporting tools.",
    responsibilities: [
      "Cyber awareness campaign deployment (planning, materials, internal communication)",
      "Power BI dashboards for security maturity indicators tracking",
      "Workflow automation (Power Automate)",
      "Inter-business unit risk analysis (impact/likelihood matrices)"
    ]
  }
];

export const getExperiences = (lang: Language): Experience[] => {
  return (lang === 'fr' ? experiencesFR : experiencesEN).map((e) => ({ ...e, ...dates[e.id] }));
};
