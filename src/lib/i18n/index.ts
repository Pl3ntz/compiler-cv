import type { Locale } from '../locales.js'
import { pt } from './pt.js'
import { en } from './en.js'

const translations: Record<Locale, Record<string, Record<string, string>>> = {
  pt,
  en,
}

export function getTranslations(
  locale: Locale,
): Record<string, Record<string, string>> {
  return translations[locale]
}
