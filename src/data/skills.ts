import type { Language } from '../types/language';
import type { SkillCategory } from '../types/skill';

const skillsFR: SkillCategory[] = [
  {
    category: "Programmation & Informatique",
    icon: "Code2",
    skills: [
      { name: "Python", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Scala", level: 70 },
      { name: "Spark", level: 75 },
      { name: "Git/GitHub", level: 90 },
      { name: "Scripting & Automatisation", level: 80 }
    ]
  },
  {
    category: "Cloud & Data Engineering",
    icon: "Cloud",
    skills: [
      { name: "Azure", level: 80 },
      { name: "Databricks", level: 85 },
      { name: "AWS (EMR)", level: 75 },
      { name: "Redshift", level: 70 },
      { name: "Jenkins", level: 80 },
      { name: "Big Data", level: 75 }
    ]
  },
  {
    category: "Gestion de projet",
    icon: "Briefcase",
    skills: [
      { name: "Agile/Scrum", level: 85 },
      { name: "Recueil des besoins", level: 90 },
      { name: "Rédaction de spécifications", level: 85 },
      { name: "Coordination", level: 80 },
      { name: "Jira/Trello", level: 90 }
    ]
  },
  {
    category: "Soft Skills",
    icon: "Users",
    skills: [
      { name: "Autonome", level: 100 },
      { name: "Adaptable", level: 100 },
      { name: "Proactif", level: 100 },
      { name: "Esprit d'équipe", level: 100 },
      { name: "Curieux", level: 100 },
      { name: "Rigoureux", level: 100 }
    ]
  }
];

const skillsEN: SkillCategory[] = [
  {
    category: "Programming & IT",
    icon: "Code2",
    skills: [
      { name: "Python", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Scala", level: 70 },
      { name: "Spark", level: 75 },
      { name: "Git/GitHub", level: 90 },
      { name: "Scripting & Automation", level: 80 }
    ]
  },
  {
    category: "Cloud & Data Engineering",
    icon: "Cloud",
    skills: [
      { name: "Azure", level: 80 },
      { name: "Databricks", level: 85 },
      { name: "AWS (EMR)", level: 75 },
      { name: "Redshift", level: 70 },
      { name: "Jenkins", level: 80 },
      { name: "Big Data", level: 75 }
    ]
  },
  {
    category: "Project Management",
    icon: "Briefcase",
    skills: [
      { name: "Agile/Scrum", level: 85 },
      { name: "Requirements Gathering", level: 90 },
      { name: "Specifications Writing", level: 85 },
      { name: "Coordination", level: 80 },
      { name: "Jira/Trello", level: 90 }
    ]
  },
  {
    category: "Soft Skills",
    icon: "Users",
    skills: [
      { name: "Autonomous", level: 100 },
      { name: "Adaptable", level: 100 },
      { name: "Proactive", level: 100 },
      { name: "Team Player", level: 100 },
      { name: "Curious", level: 100 },
      { name: "Rigorous", level: 100 }
    ]
  }
];

export const getSkills = (lang: Language): SkillCategory[] => {
  return lang === 'fr' ? skillsFR : skillsEN;
};
