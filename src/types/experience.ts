export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  start: string; // 'YYYY-MM'
  end?: string;  // 'YYYY-MM', absent = en cours
  contractType: string;
  description: string;
  responsibilities: string[];
}
