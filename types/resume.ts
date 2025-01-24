export type SectionType = 'education' | 'experience' | 'projects' | 'additional' | 'custom'

export interface Section {
  id: string
  type: SectionType
  title: string
  items: any[]
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

