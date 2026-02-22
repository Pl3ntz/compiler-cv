export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Esqueci a senha</h1>
      <p className="text-text-secondary mb-6">Entre em contato com o administrador para redefinir sua senha.</p>
      <a href="/auth/login" className="block w-full py-2.5 text-center text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 hover:text-text-primary transition-all">
        Voltar para a tela de acesso
      </a>
    </>
  )
}
