export type SectionType = 
  'education' | 
  'experience' | 
  'projects' | 
  'custom'; // Add any other needed types

export interface Section {
  id: string
  type: SectionType
  title: string
  items: EducationItem[] | ExperienceItem[] | ProjectItem[] | AdditionalItem[]
}

export interface EducationItem {
  id: string
  title: string
  degree: string
  institution: string
  startDate?: string
  endDate?: string
  isPresent?: boolean
  location: string
  accomplishments: string[]
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  position: string;
  startDate?: string
  endDate?: string
  isPresent?: boolean
  location: string;
  accomplishments: string[];
}

export interface ProjectItem {
  id: string
  title: string
  skills: string
  startDate?: string
  endDate?: string
  isPresent?: boolean
  location: string
  accomplishments: string[]
}

export interface AdditionalItem {
  id: string;
  title: string;
  startDate?: string
  endDate?: string
  isPresent?: boolean
  location: string;
  accomplishments: string[];
}

export interface SectionItem {
  id: string;
  degree?: string;
  institution?: string;
  startDate?: string
  endDate?: string
  isPresent?: boolean
  location: string;
  accomplishments: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    linkedin: string
    github: string
  }
  sections: Section[]
}

export interface DragItem {
  type: string
  id: string
  index: number
} 