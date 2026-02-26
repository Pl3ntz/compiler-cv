import type { Locale } from './types.js'

const dict: Record<string, Record<string, string>> = {
  en: {
    // --- contact ---
    'contact.name_missing': 'Name is missing',
    'contact.name_ok': 'Name is present',
    'contact.email_missing': 'Email is missing',
    'contact.email_ok': 'Valid email address',
    'contact.email_invalid': 'Email format is invalid',
    'contact.phone_missing': 'Phone number is missing',
    'contact.phone_ok': 'Phone number is present',
    'contact.linkedin_missing': 'LinkedIn profile is missing',
    'contact.linkedin_ok': 'Valid LinkedIn profile URL',
    'contact.linkedin_invalid': 'LinkedIn URL should contain linkedin.com/in/',
    'contact.location_missing': 'Location is missing',
    'contact.location_ok': 'Location is present',

    // --- summary ---
    'summary.missing': 'Professional summary is missing',
    'summary.present': 'Professional summary is present',
    'summary.too_short': 'Summary is too short — aim for 2-5 sentences',
    'summary.too_long': 'Summary is too long — aim for 2-5 sentences',
    'summary.good_length': 'Summary has an ideal length (2-5 sentences)',
    'summary.has_pronouns': 'Avoid first-person pronouns in summary (e.g. "I", "my")',
    'summary.no_pronouns': 'No first-person pronouns in summary',

    // --- experience ---
    'experience.no_items': 'No work experience entries',
    'experience.has_items': 'Work experience section is filled',
    'experience.missing_fields': '{count} experience item(s) missing company, role, or date',
    'experience.fields_complete': 'All experience entries have company, role, and date',
    'experience.few_highlights': 'Add more bullet points per experience (aim for 3-6)',
    'experience.many_highlights': 'Too many bullet points per experience — focus on top 3-6 achievements',
    'experience.no_highlights': 'Experience items have no bullet points',
    'experience.good_highlights': 'Good number of bullet points per experience (3-6)',
    'experience.strong_verbs': 'Bullet points use strong action verbs',
    'experience.some_weak_verbs': 'Use stronger action verbs to start bullet points',
    'experience.weak_verbs': 'Most bullets start with weak verbs — use strong action verbs',
    'experience.quantified': 'Achievements are well quantified with metrics',
    'experience.some_metrics': 'Add more metrics and numbers to your achievements',
    'experience.needs_metrics': 'Quantify your achievements with numbers, percentages, or dollar amounts',

    // --- education ---
    'education.no_items': 'No education entries',
    'education.has_items': 'Education section is filled',
    'education.missing_fields': '{count} education item(s) missing institution or degree',
    'education.fields_complete': 'All education entries have institution and degree',
    'education.missing_dates': 'Some education items are missing dates',
    'education.dates_complete': 'All education entries have dates',

    // --- skills ---
    'skills.no_categories': 'No skill categories listed',
    'skills.has_categories': 'Skills section is filled',
    'skills.few_categories': 'Add at least 2 skill categories for better organization',
    'skills.good_categories': 'Skills are well organized in multiple categories',
    'skills.few_skills': 'Only {count} skills listed — aim for at least 8',
    'skills.enough_skills': 'Good number of skills listed (8+)',
    'skills.empty_category': '{count} skill category(ies) have empty name or values',
    'skills.no_empty': 'All skill categories are properly filled',

    // --- projects ---
    'projects.no_items': 'No projects listed',
    'projects.has_items': 'Projects section is filled',
    'projects.missing_fields': '{count} project(s) missing name or highlights',
    'projects.fields_complete': 'All projects have name and highlights',

    // --- languages ---
    'languages.no_items': 'No languages listed',
    'languages.has_items': 'Languages section is filled',
    'languages.missing_fields': '{count} language(s) missing name or proficiency level',
    'languages.fields_complete': 'All languages have name and proficiency level',

    // --- formatting ---
    'formatting.good_length': 'CV word count is in the ideal range (450-1200)',
    'formatting.short': 'CV has {count} words — aim for 450-1200 for optimal ATS performance',
    'formatting.long': 'CV has {count} words — consider trimming to under 1200',
    'formatting.very_off': 'CV has {count} words — far from the 450-1200 ideal range',
    'formatting.empty': 'CV appears to be empty',
    'formatting.no_empty_bullets': 'No empty bullet points',
    'formatting.empty_bullets': '{count} empty bullet point(s) found — remove or fill them',
    'formatting.ats_dates': 'All dates use ATS-friendly formats',
    'formatting.bad_dates': '{count} date(s) may not be ATS-friendly — use "Month YYYY" or "MM/YYYY" format',
    'formatting.no_pronouns': 'No first-person pronouns detected',
    'formatting.has_pronouns': 'First-person pronouns detected — remove "I", "my", etc. for a professional tone',

    // --- date-continuity ---
    'dateContinuity.dates_parseable': 'All employment dates are parseable',
    'dateContinuity.some_unparseable': '{count} date(s) could not be parsed for gap analysis',
    'dateContinuity.no_gaps': 'No significant employment gaps detected',
    'dateContinuity.has_gaps': 'Employment gap longer than 6 months detected — consider addressing it',
  },
  pt: {
    // --- contact ---
    'contact.name_missing': 'Nome não informado',
    'contact.name_ok': 'Nome preenchido',
    'contact.email_missing': 'E-mail não informado',
    'contact.email_ok': 'E-mail válido',
    'contact.email_invalid': 'Formato de e-mail inválido',
    'contact.phone_missing': 'Telefone não informado',
    'contact.phone_ok': 'Telefone preenchido',
    'contact.linkedin_missing': 'Perfil do LinkedIn não informado',
    'contact.linkedin_ok': 'URL do LinkedIn válida',
    'contact.linkedin_invalid': 'URL do LinkedIn deve conter linkedin.com/in/',
    'contact.location_missing': 'Localização não informada',
    'contact.location_ok': 'Localização preenchida',

    // --- summary ---
    'summary.missing': 'Resumo profissional não informado',
    'summary.present': 'Resumo profissional preenchido',
    'summary.too_short': 'Resumo muito curto — mire em 2-5 frases',
    'summary.too_long': 'Resumo muito longo — mire em 2-5 frases',
    'summary.good_length': 'Resumo com tamanho ideal (2-5 frases)',
    'summary.has_pronouns': 'Evite pronomes em primeira pessoa no resumo (ex: "eu", "meu")',
    'summary.no_pronouns': 'Sem pronomes em primeira pessoa no resumo',

    // --- experience ---
    'experience.no_items': 'Nenhuma experiência profissional',
    'experience.has_items': 'Seção de experiência preenchida',
    'experience.missing_fields': '{count} item(ns) de experiência sem empresa, cargo ou data',
    'experience.fields_complete': 'Todos os itens de experiência têm empresa, cargo e data',
    'experience.few_highlights': 'Adicione mais bullet points por experiência (mire em 3-6)',
    'experience.many_highlights': 'Muitos bullet points por experiência — foque nos 3-6 melhores',
    'experience.no_highlights': 'Itens de experiência sem bullet points',
    'experience.good_highlights': 'Boa quantidade de bullet points por experiência (3-6)',
    'experience.strong_verbs': 'Bullets usam verbos de ação fortes',
    'experience.some_weak_verbs': 'Use verbos de ação mais fortes no início dos bullets',
    'experience.weak_verbs': 'A maioria dos bullets usa verbos fracos — use verbos de ação fortes',
    'experience.quantified': 'Conquistas bem quantificadas com métricas',
    'experience.some_metrics': 'Adicione mais métricas e números às suas conquistas',
    'experience.needs_metrics': 'Quantifique conquistas com números, % ou R$',

    // --- education ---
    'education.no_items': 'Nenhuma formação acadêmica',
    'education.has_items': 'Seção de formação preenchida',
    'education.missing_fields': '{count} item(ns) de formação sem instituição ou grau',
    'education.fields_complete': 'Todos os itens de formação têm instituição e grau',
    'education.missing_dates': 'Alguns itens de formação estão sem datas',
    'education.dates_complete': 'Todos os itens de formação têm datas',

    // --- skills ---
    'skills.no_categories': 'Nenhuma categoria de habilidades',
    'skills.has_categories': 'Seção de habilidades preenchida',
    'skills.few_categories': 'Adicione pelo menos 2 categorias de habilidades para melhor organização',
    'skills.good_categories': 'Habilidades bem organizadas em múltiplas categorias',
    'skills.few_skills': 'Apenas {count} habilidades listadas — mire em pelo menos 8',
    'skills.enough_skills': 'Boa quantidade de habilidades listadas (8+)',
    'skills.empty_category': '{count} categoria(s) de habilidades com nome ou valores vazios',
    'skills.no_empty': 'Todas as categorias de habilidades estão preenchidas',

    // --- projects ---
    'projects.no_items': 'Nenhum projeto listado',
    'projects.has_items': 'Seção de projetos preenchida',
    'projects.missing_fields': '{count} projeto(s) sem nome ou destaques',
    'projects.fields_complete': 'Todos os projetos têm nome e destaques',

    // --- languages ---
    'languages.no_items': 'Nenhum idioma listado',
    'languages.has_items': 'Seção de idiomas preenchida',
    'languages.missing_fields': '{count} idioma(s) sem nome ou nível de proficiência',
    'languages.fields_complete': 'Todos os idiomas têm nome e nível de proficiência',

    // --- formatting ---
    'formatting.good_length': 'Contagem de palavras do CV na faixa ideal (450-1200)',
    'formatting.short': 'CV com {count} palavras — mire em 450-1200 para melhor desempenho em ATS',
    'formatting.long': 'CV com {count} palavras — considere reduzir para menos de 1200',
    'formatting.very_off': 'CV com {count} palavras — longe da faixa ideal de 450-1200',
    'formatting.empty': 'CV parece estar vazio',
    'formatting.no_empty_bullets': 'Sem bullet points vazios',
    'formatting.empty_bullets': '{count} bullet point(s) vazio(s) encontrado(s) — remova ou preencha',
    'formatting.ats_dates': 'Todas as datas usam formatos compatíveis com ATS',
    'formatting.bad_dates': '{count} data(s) podem não ser compatíveis com ATS — use formato "Mês AAAA" ou "MM/AAAA"',
    'formatting.no_pronouns': 'Sem pronomes em primeira pessoa detectados',
    'formatting.has_pronouns': 'Pronomes em primeira pessoa detectados — remova "eu", "meu" etc. para tom profissional',

    // --- date-continuity ---
    'dateContinuity.dates_parseable': 'Todas as datas de emprego são interpretáveis',
    'dateContinuity.some_unparseable': '{count} data(s) não puderam ser interpretadas para análise de lacunas',
    'dateContinuity.no_gaps': 'Nenhuma lacuna significativa no histórico profissional',
    'dateContinuity.has_gaps': 'Lacuna de mais de 6 meses detectada — considere abordar isso',
  },
}

export function msg(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const text = dict[locale]?.[key] ?? dict.en[key] ?? key
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`))
}
