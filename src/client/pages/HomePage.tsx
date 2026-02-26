import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import Brand from '../components/Brand.js'

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ── page ───────────────────────────────────────────────── */
export default function HomePage() {
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
            <a href="#features" className="hover:text-text-primary transition-colors no-underline">Recursos</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors no-underline">Como Funciona</a>
            <Link to="/analise-ats" className="hover:text-text-primary transition-colors no-underline">Analise ATS</Link>
            <a href="#highlights" className="hover:text-text-primary transition-colors no-underline">Diferenciais</a>
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
                  Começar Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.07)_0%,transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,160,74,0.04)_0%,transparent_50%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative max-w-4xl mx-auto text-center px-5 sm:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs font-semibold tracking-wide uppercase mb-7">
              Construtor de Currículos com IA
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent">
              Forje o currículo que{' '}
            </span>
            <span className="bg-gradient-to-r from-ember-400 to-molten-400 bg-clip-text text-transparent">
              abre portas
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Editor visual com visualização ao vivo, exportação PDF com qualidade profissional,
            análise de compatibilidade com sistemas de recrutamento por inteligência artificial e importação automática de PDFs existentes.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="group inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-ember-500 rounded-xl hover:bg-ember-400 transition-all shadow-xl shadow-ember-500/20 hover:shadow-ember-400/25 hover:-translate-y-0.5 no-underline"
            >
              Criar meu Currículo
              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center px-8 py-3.5 text-base font-medium text-text-secondary border border-forge-600 rounded-xl hover:bg-forge-800 hover:text-text-primary transition-all no-underline"
            >
              Já tenho conta
            </Link>
          </motion.div>

          <motion.p variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }} className="text-xs text-text-muted mt-6">
            Gratuito. Sem cartão de crédito.
          </motion.p>
        </motion.div>
      </header>

      {/* ━━ FEATURES (Bento Grid) ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section id="features" className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Tudo que você precisa em um só lugar</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Ferramentas profissionais para criar, otimizar e exportar seu currículo com perfeição.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 — large */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="sm:col-span-2 lg:col-span-2 bg-forge-800/60 border border-forge-600/50 rounded-2xl p-7 hover:border-molten-500/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-ember-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1.5">Visualização ao vivo</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Edite e veja seu currículo atualizar instantaneamente. Cada campo, cada seção — tudo reflete em tempo real na visualização ao lado, sem atrasos e sem recarregar.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-7 hover:border-molten-500/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-molten-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-molten-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1.5">PDF via LaTeX</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Exporte PDFs com tipografia profissional usando o motor Tectonic. Resultado limpo, elegante e pronto para imprimir.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-7 hover:border-molten-500/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-ember-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1.5">Análise ATS com IA</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Receba pontuação de 0 a 100 e sugestões priorizadas para passar por sistemas de triagem como Workday, Greenhouse e Lever.</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-7 hover:border-molten-500/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-molten-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-molten-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1.5">Importação de PDF</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Envie seu currículo atual em PDF e a IA preenche todos os campos automaticamente. Sem redigitar nada.</p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-7 hover:border-molten-500/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-ember-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-ember-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1.5">Multi-idioma</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Crie currículos em Português e Inglês. Os rótulos, seções e padrões se adaptam automaticamente ao idioma escolhido.</p>
          </motion.div>
        </div>
      </Section>

      {/* ━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section id="how-it-works" className="bg-forge-900/50 border-y border-forge-700/30 py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Como funciona</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Três passos para ter um currículo profissional pronto para enviar.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              {
                step: '01',
                title: 'Crie ou importe',
                desc: 'Comece do zero escolhendo idioma e modelo, ou envie um PDF existente para a IA preencher tudo automaticamente.',
              },
              {
                step: '02',
                title: 'Edite com visualização ao vivo',
                desc: 'Use o editor visual com 7 seções completas. Cada alteração aparece em tempo real na visualização ao lado. Salvamento automático incluso.',
              },
              {
                step: '03',
                title: 'Exporte e aplique',
                desc: 'Gere um PDF com tipografia LaTeX profissional. Analise a compatibilidade ATS com IA antes de enviar para as vagas.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center sm:text-left"
              >
                <span className="text-5xl font-extrabold text-forge-700 select-none">{item.step}</span>
                <h3 className="text-lg font-semibold text-text-primary mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ━━ ATS EVALUATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section id="ats-evaluation" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Como avaliamos seu curriculo</h2>
          <p className="text-text-secondary max-w-xl mx-auto">9 criterios analisados automaticamente, somando 100 pontos.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
              name: 'Contato',
              points: 10,
              desc: 'Nome, e-mail, telefone, LinkedIn e localizacao.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              ),
              name: 'Resumo',
              points: 10,
              desc: 'Presente, 2-5 frases, sem pronomes em 1a pessoa.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              ),
              name: 'Experiencia',
              points: 30,
              desc: 'Verbos de acao, metricas quantificadas, 3-6 bullets.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              ),
              name: 'Formacao',
              points: 8,
              desc: 'Instituicao, grau e datas presentes.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
              name: 'Habilidades',
              points: 12,
              desc: '2+ categorias com 8+ skills no total.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              ),
              name: 'Formatacao',
              points: 15,
              desc: 'Tamanho ideal, datas ATS-safe, sem bullets vazios.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              ),
              name: 'Continuidade',
              points: 5,
              desc: 'Datas parseaveis e sem lacunas grandes.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              ),
              name: 'Projetos',
              points: 5,
              desc: 'Nome e highlights de projetos relevantes.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              ),
              name: 'Idiomas',
              points: 5,
              desc: 'Nome e nivel de proficiencia de cada idioma.',
            },
          ].map((item) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="bg-forge-800/60 border border-forge-600/50 rounded-2xl p-5 hover:border-molten-500/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-ember-500/10 flex items-center justify-center text-ember-400 flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-ember-500/15 text-ember-400 text-xs font-semibold">
                  {item.points} pts
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center mt-10">
          <Link
            to="/analise-ats"
            className="group inline-flex items-center px-6 py-3 text-sm font-semibold text-ember-400 border border-ember-500/30 rounded-xl hover:bg-ember-500/10 transition-all no-underline"
          >
            Ver detalhes completos
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </Section>

      {/* ━━ HIGHLIGHTS / DIFFERENTIALS ━━━━━━━━━━━━━━━━━━━━ */}
      <Section id="highlights" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Por que escolher a Forja?</h2>
          <p className="text-text-secondary max-w-lg mx-auto">Construído para quem leva a carreira a sério.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              ),
              title: 'Seus dados são seus',
              desc: 'Nada de compartilhar com terceiros. Seus dados ficam no banco de dados criptografado e você pode excluir tudo a qualquer momento.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              ),
              title: 'Salvamento automático',
              desc: 'Cada alteração é salva automaticamente a cada 1.5 segundos. Se a conexão cair, você nunca perde seu progresso.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              ),
              title: 'LaTeX sem complicação',
              desc: 'Você não precisa saber LaTeX. O motor Tectonic cuida da compilação e gera PDFs com a mesma qualidade que acadêmicos e pesquisadores usam.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              ),
              title: 'Pronto para ATS',
              desc: 'A IA analisa seu currículo contra os mesmos critérios usados por Workday, Greenhouse, Lever e iCIMS. Receba sugestões categorizadas por prioridade.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              ),
              title: 'Múltiplos currículos',
              desc: 'Mantenha versões diferentes para vagas diferentes. Um em Português para o mercado nacional, outro em Inglês para oportunidades internacionais.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              ),
              title: 'Responsivo',
              desc: 'Edite no computador ou no celular. A interface se adapta para qualquer tamanho de tela sem perder funcionalidade.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4 bg-forge-800/40 border border-forge-600/40 rounded-xl p-6 hover:border-forge-600/70 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-forge-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  {item.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━ FINAL CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center px-5 sm:px-8">
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
          >
            Pronto para forjar seu futuro?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-text-secondary mb-8 max-w-lg mx-auto"
          >
            Crie um currículo que se destaque. Gratuito, sem limitações e sem cartão de crédito.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="group inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-ember-500 rounded-xl hover:bg-ember-400 transition-all shadow-xl shadow-ember-500/20 hover:shadow-ember-400/25 hover:-translate-y-0.5 no-underline"
            >
              Começar Agora
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
            {/* Brand */}
            <div className="sm:col-span-2">
              <Brand iconSize={36} textClassName="text-base" className="mb-3" />
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
                Construtor de currículos profissionais com editor visual, exportação LaTeX e análise ATS por inteligência artificial.
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Recursos</a></li>
                <li><a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Como Funciona</a></li>
                <li><Link to="/analise-ats" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Analise ATS</Link></li>
                <li><a href="#highlights" className="text-text-secondary hover:text-text-primary transition-colors no-underline">Diferenciais</a></li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-text-secondary">Política de Privacidade</span></li>
                <li><span className="text-text-secondary">Termos de Uso</span></li>
                <li><span className="text-text-secondary">Política de Cookies</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-forge-700/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Forja. Todos os direitos reservados.
            </p>
            <p className="text-xs text-text-muted">
              Feito com LaTeX, React e muita dedicação.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
