import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import Brand from '../components/Brand.js'

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ── data ──────────────────────────────────────────────── */
type Priority = 'critical' | 'recommended' | 'optional'

interface Check {
  name: string
  points: number
  priority: Priority
}

interface ScoringSection {
  name: string
  maxPoints: number
  icon: React.ReactNode
  checks: Check[]
}

const priorityColors: Record<Priority, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Critico' },
  recommended: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Recomendado' },
  optional: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Opcional' },
}

const sections: ScoringSection[] = [
  {
    name: 'Contato',
    maxPoints: 10,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    checks: [
      { name: 'Nome presente', points: 2, priority: 'critical' },
      { name: 'E-mail presente', points: 1, priority: 'critical' },
      { name: 'E-mail em formato valido', points: 2, priority: 'recommended' },
      { name: 'Telefone presente', points: 2, priority: 'recommended' },
      { name: 'LinkedIn valido (linkedin.com/in/)', points: 2, priority: 'recommended' },
      { name: 'Localizacao presente', points: 1, priority: 'optional' },
    ],
  },
  {
    name: 'Resumo Profissional',
    maxPoints: 10,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
    checks: [
      { name: 'Resumo presente', points: 3, priority: 'critical' },
      { name: 'Entre 2 e 5 frases', points: 4, priority: 'recommended' },
      { name: 'Sem pronomes em 1a pessoa', points: 3, priority: 'recommended' },
    ],
  },
  {
    name: 'Experiencia',
    maxPoints: 30,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    checks: [
      { name: 'Pelo menos 1 experiencia', points: 5, priority: 'critical' },
      { name: 'Campos obrigatorios (empresa, cargo, data)', points: 5, priority: 'critical' },
      { name: '3 a 6 bullet points por experiencia', points: 5, priority: 'recommended' },
      { name: '80%+ dos bullets com verbos de acao fortes', points: 8, priority: 'critical' },
      { name: '50%+ dos bullets com metricas quantificadas', points: 7, priority: 'recommended' },
    ],
  },
  {
    name: 'Formacao',
    maxPoints: 8,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    checks: [
      { name: 'Pelo menos 1 formacao', points: 3, priority: 'critical' },
      { name: 'Instituicao e grau presentes', points: 3, priority: 'recommended' },
      { name: 'Datas presentes', points: 2, priority: 'optional' },
    ],
  },
  {
    name: 'Habilidades',
    maxPoints: 12,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    checks: [
      { name: 'Pelo menos 1 categoria', points: 3, priority: 'critical' },
      { name: '2 ou mais categorias', points: 3, priority: 'recommended' },
      { name: '8 ou mais skills no total', points: 3, priority: 'recommended' },
      { name: 'Nenhuma categoria vazia', points: 3, priority: 'recommended' },
    ],
  },
  {
    name: 'Formatacao',
    maxPoints: 15,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    checks: [
      { name: 'Entre 450 e 1200 palavras', points: 5, priority: 'critical' },
      { name: 'Sem bullet points vazios', points: 3, priority: 'recommended' },
      { name: 'Datas em formato ATS-safe (Month YYYY)', points: 4, priority: 'recommended' },
      { name: 'Sem pronomes em 1a pessoa (global)', points: 3, priority: 'recommended' },
    ],
  },
  {
    name: 'Continuidade',
    maxPoints: 5,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    checks: [
      { name: 'Datas parseaveis em todas experiencias', points: 2, priority: 'optional' },
      { name: 'Sem lacunas maiores que 6 meses', points: 3, priority: 'optional' },
    ],
  },
  {
    name: 'Projetos',
    maxPoints: 5,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    checks: [
      { name: 'Pelo menos 1 projeto', points: 2, priority: 'optional' },
      { name: 'Nome e highlights presentes', points: 3, priority: 'recommended' },
    ],
  },
  {
    name: 'Idiomas',
    maxPoints: 5,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
    checks: [
      { name: 'Pelo menos 1 idioma', points: 2, priority: 'optional' },
      { name: 'Nome e nivel presentes', points: 3, priority: 'recommended' },
    ],
  },
]

/* ── components ────────────────────────────────────────── */
function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priorityColors[priority]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.bg} ${p.text}`}>
      {p.label}
    </span>
  )
}

function ScoringTable({ section }: { section: ScoringSection }) {
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-forge-600/50 bg-forge-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ember-500/10 flex items-center justify-center text-ember-400">
            {section.icon}
          </div>
          <h3 className="text-base font-semibold text-text-primary">{section.name}</h3>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-ember-500/15 text-ember-400 text-sm font-semibold">
          {section.maxPoints} pts
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-text-muted uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Check</th>
              <th className="text-center px-4 py-3 font-medium w-20">Pontos</th>
              <th className="text-center px-4 py-3 font-medium w-32">Prioridade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-700/30">
            {section.checks.map((check) => (
              <tr key={check.name} className="hover:bg-forge-700/20 transition-colors">
                <td className="px-6 py-3 text-sm text-text-secondary">{check.name}</td>
                <td className="text-center px-4 py-3 text-sm font-medium text-text-primary">{check.points}</td>
                <td className="text-center px-4 py-3">
                  <PriorityBadge priority={check.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

/* ── page ───────────────────────────────────────────────── */
export default function AtsAnalysisPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-forge-950 text-text-primary">

      {/* ━━ NAVBAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-forge-950/80 backdrop-blur-xl border-b border-forge-700/50"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="no-underline">
            <Brand iconSize={42} textClassName="text-xl" />
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
            <Link to="/#features" className="hover:text-text-primary transition-colors no-underline">Recursos</Link>
            <Link to="/#how-it-works" className="hover:text-text-primary transition-colors no-underline">Como Funciona</Link>
            <Link to="/analise-ats" className="text-ember-400 font-medium no-underline">Analise ATS</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="px-5 py-2 text-sm font-medium text-white bg-ember-500 rounded-lg hover:bg-ember-400 transition-all shadow-lg shadow-ember-500/20 no-underline">
                Painel
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors no-underline">
                  Entrar
                </Link>
                <Link to="/auth/register" className="px-5 py-2 text-sm font-medium text-white bg-ember-500 rounded-lg hover:bg-ember-400 transition-all shadow-lg shadow-ember-500/20 no-underline">
                  Comecar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.07)_0%,transparent_55%)] pointer-events-none" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative max-w-4xl mx-auto text-center px-5 sm:px-8 pt-16 pb-12 lg:pt-20 lg:pb-16"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs font-semibold tracking-wide uppercase mb-6">
              Sistema de Pontuacao ATS
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight"
          >
            <span className="bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent">
              Como a Forja avalia{' '}
            </span>
            <span className="bg-gradient-to-r from-ember-400 to-molten-400 bg-clip-text text-transparent">
              seu curriculo
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Cada curriculo e avaliado automaticamente em 9 criterios que somam 100 pontos.
            Entenda exatamente o que e analisado e como melhorar sua pontuacao.
          </motion.p>
        </motion.div>
      </header>

      {/* ━━ SCORING SECTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section className="max-w-4xl mx-auto px-5 sm:px-8 pb-16 w-full">
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <ScoringTable key={section.name} section={section} />
          ))}
        </div>
      </Section>

      {/* ━━ LEGEND + LLM INFO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section className="max-w-4xl mx-auto px-5 sm:px-8 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority legend */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">Niveis de Prioridade</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-red-400">Critico</span>
                  <p className="text-sm text-text-secondary mt-0.5">Requisitos essenciais. A ausencia pode resultar em rejeicao automatica pelo ATS.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-yellow-400">Recomendado</span>
                  <p className="text-sm text-text-secondary mt-0.5">Melhora significativamente a pontuacao. Recrutadores esperam ver estes itens.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-green-400">Opcional</span>
                  <p className="text-sm text-text-secondary mt-0.5">Bonus que diferencia seu curriculo. Nao penaliza se ausente.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LLM grading info */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">Avaliacao por IA (LLM Grading)</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Alem dos 100 pontos estruturais, a inteligencia artificial avalia a qualidade da escrita
              do seu curriculo como um todo.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              A IA pode aplicar um ajuste de ate <span className="text-ember-400 font-medium">-10 pontos</span> com
              base em criterios como clareza, impacto dos bullet points, consistencia de linguagem e
              relevancia do conteudo.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Um curriculo bem escrito mantem a pontuacao maxima. Textos vagos, genericos ou com erros
              podem reduzir a nota final.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ━━ FINAL CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center px-5 sm:px-8">
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            Pronto para otimizar seu curriculo?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-text-secondary mb-8 max-w-lg mx-auto"
          >
            Crie seu curriculo e receba a analise ATS completa com sugestoes priorizadas.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <Link
              to="/auth/register"
              className="group inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-ember-500 rounded-xl hover:bg-ember-400 transition-all shadow-xl shadow-ember-500/20 hover:shadow-ember-400/25 hover:-translate-y-0.5 no-underline"
            >
              Criar meu Curriculo
              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="border-t border-forge-700/40 bg-forge-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2">
              <Brand iconSize={36} textClassName="text-base" className="mb-3" />
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
                Construtor de curriculos profissionais com editor visual, exportacao LaTeX e analise ATS por inteligencia artificial.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/#features" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Recursos</Link></li>
                <li><Link to="/#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Como Funciona</Link></li>
                <li><Link to="/analise-ats" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Analise ATS</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-text-secondary">Politica de Privacidade</span></li>
                <li><span className="text-text-secondary">Termos de Uso</span></li>
                <li><span className="text-text-secondary">Politica de Cookies</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-forge-700/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Forja. Todos os direitos reservados.
            </p>
            <p className="text-xs text-text-muted">
              Feito com LaTeX, React e muita dedicacao.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
