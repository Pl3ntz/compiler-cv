import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import CvEditorForm from '../components/CvEditorForm.js'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/locales.js'
import { getTranslations } from '@/lib/i18n/index.js'
import { isValidUuid } from '@/lib/validation.js'
import type { CvInput } from '@/lib/zod-schemas/cv.js'

export default function EditorPage() {
  const { cvId } = useParams<{ cvId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cvData, setCvData] = useState<CvInput | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cvId || !isValidUuid(cvId)) {
      navigate('/dashboard')
      return
    }

    fetch(`/api/cv/${cvId}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data) => setCvData(data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [cvId, navigate])

  if (loading || !cvData || !cvId || !user) {
    return (
      <div className="h-screen bg-forge-950 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-forge-600 border-t-ember-500 rounded-full animate-spin" />
      </div>
    )
  }

  const cvLocale = (cvData.locale as Locale) ?? 'en'
  const labels = getTranslations(cvLocale)
  const localeOptions = LOCALES.map((l) => ({ value: l, label: LOCALE_LABELS[l] }))

  return (
    <CvEditorForm
      initialData={cvData}
      cvId={cvId}
      locale={cvLocale}
      labels={labels}
      localeOptions={localeOptions}
      user={{
        name: user.name ?? '',
        email: user.email ?? '',
        isAdmin: user.role === 'admin',
      }}
    />
  )
}
