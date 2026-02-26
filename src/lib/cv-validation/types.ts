export type SectionKey = 'header' | 'summary' | 'education' | 'experience' |
                         'projects' | 'skills' | 'languages' | 'general'
export type Priority = 'critical' | 'recommended' | 'optional'
export type Locale = 'pt' | 'en'

export interface ValidationIssue {
  text: string
  priority: Priority
  section: SectionKey
}

export interface ValidationPositive {
  text: string
  section: SectionKey
}

export interface SectionScore {
  earned: number
  max: number
  issues: ValidationIssue[]
  positives: ValidationPositive[]
}

export interface RuleBasedResult {
  totalScore: number
  maxScore: number
  sections: {
    contact: SectionScore
    summary: SectionScore
    experience: SectionScore
    education: SectionScore
    skills: SectionScore
    formatting: SectionScore
    dateContinuity: SectionScore
    languages: SectionScore
    projects: SectionScore
  }
}
