import type { CvInput } from '../zod-schemas/cv.js'
import type { Locale, RuleBasedResult } from './types.js'
import { checkContact } from './checks/contact.js'
import { checkSummary } from './checks/summary.js'
import { checkExperience } from './checks/experience.js'
import { checkEducation } from './checks/education.js'
import { checkSkills } from './checks/skills.js'
import { checkProjects } from './checks/projects.js'
import { checkLanguages } from './checks/languages.js'
import { checkFormatting } from './checks/formatting.js'
import { checkDateContinuity } from './checks/date-continuity.js'

export function runRuleBasedChecks(cv: CvInput, locale: Locale): RuleBasedResult {
  const sections = {
    contact: checkContact(cv, locale),
    summary: checkSummary(cv, locale),
    experience: checkExperience(cv, locale),
    education: checkEducation(cv, locale),
    skills: checkSkills(cv, locale),
    projects: checkProjects(cv, locale),
    languages: checkLanguages(cv, locale),
    formatting: checkFormatting(cv, locale),
    dateContinuity: checkDateContinuity(cv, locale),
  }
  const totalScore = Object.values(sections).reduce((sum, s) => sum + s.earned, 0)
  return { totalScore, maxScore: 100, sections }
}

export type { RuleBasedResult, SectionScore, ValidationIssue, Locale, Priority, SectionKey } from './types.js'
