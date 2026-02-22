const LATEX_SPECIAL: ReadonlyMap<string, string> = new Map([
  ['\\', '\\textbackslash{}'],
  ['&', '\\&'],
  ['%', '\\%'],
  ['$', '\\$'],
  ['#', '\\#'],
  ['_', '\\_'],
  ['{', '\\{'],
  ['}', '\\}'],
  ['~', '\\textasciitilde{}'],
  ['^', '\\textasciicircum{}'],
])

const LATEX_ESCAPE_REGEX = /[\\&%$#_{}~^]/g

export function latexEscape(text: string): string {
  return text.replace(LATEX_ESCAPE_REGEX, (char) => {
    return LATEX_SPECIAL.get(char) ?? char
  })
}
