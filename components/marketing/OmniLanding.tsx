import Image from "next/image";
import Link from "next/link";

const recursos = [
  {
    numero: "01",
    titulo: "Atendimento em uma só central",
    descricao:
      "Acompanhe conversas, histórico e contexto do cliente para sua equipe não começar do zero a cada contato.",
    destaque: "Caixa de entrada compartilhada",
  },
  {
    numero: "02",
    titulo: "CRM que acompanha a conversa",
    descricao:
      "Transforme o atendimento em oportunidades, organize seu funil e saiba o que precisa avançar.",
    destaque: "Funil e relacionamento",
  },
  {
    numero: "03",
    titulo: "IA com passagem para humanos",
    descricao:
      "Configure agentes para apoiar o atendimento e direcionar casos que precisam de uma pessoa.",
    destaque: "Automação com controle",
  },
  {
    numero: "04",
    titulo: "Agenda e integrações",
    descricao:
      "Conecte recursos disponíveis, como o Google Agenda, para reunir compromissos e operação no mesmo fluxo.",
    destaque: "Rotina conectada",
  },
  {
    numero: "05",
    titulo: "Histórico e rastreabilidade",
    descricao:
      "Tenha informações da operação, atividades e registros para acompanhar o relacionamento com cada cliente.",
    destaque: "Visibilidade para a equipe",
  },
  {
    numero: "06",
    titulo: "Sua operação, sua estrutura",
    descricao:
      "Uma solução que pode ser executada em infraestrutura própria, com configurações adequadas à sua equipe.",
    destaque: "Implantação self-hosted",
  },
] as const;

const passos = [
  { numero: "01", titulo: "Conecte", descricao: "Reúna canais e equipe no ambiente de atendimento." },
  { numero: "02", titulo: "Organize", descricao: "Estruture contatos, conversas e etapas do funil." },
  { numero: "03", titulo: "Evolua", descricao: "Use automações e acompanhe os resultados da operação." },
] as const;

const endereco = "omni@infohelpsolucoes.com.br";
const solicitarDemonstracao = `mailto:${endereco}?subject=${encodeURIComponent(
  "Quero conhecer o InfoHelp Omni",
)}&body=${encodeURIComponent(
  "Olá! Quero saber mais sobre o InfoHelp Omni e conversar sobre uma demonstração.",
)}`;

export function OmniLanding({ nome }: { nome: string }) {
  return (
    <div className="min-h-dvh bg-[#06101d] text-[#f6fbff]">
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-72 right-[-15rem] -z-10 h-[42rem] w-[42rem] rounded-full opacity-30 blur-[110px]"
          style={{ background: "radial-gradient(circle, #1588e8, #a497ff 48%, transparent 75%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-12rem] top-[26rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-[#50e6ed]/20 blur-[110px]"
        />

        <header className="border-b border-white/10 bg-[#06101d]/85">
          <nav aria-label="Navegação principal" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <Link href="/" aria-label="Início — InfoHelp Omni" className="block shrink-0">
              <Image src="/brand/omni-logo-white.svg" alt="InfoHelp Omni" width={1260} height={280} className="h-auto w-40 sm:w-48" priority />
            </Link>
            <div className="hidden items-center gap-8 text-sm text-[#bcd5e7] md:flex">
              <a href="#recursos" className="transition hover:text-[#50e6ed]">Recursos</a>
              <a href="#como-funciona" className="transition hover:text-[#50e6ed]">Como funciona</a>
              <a href="#demonstracao" className="transition hover:text-[#50e6ed]">Demonstração</a>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#50e6ed]/40 px-4 py-2 text-sm font-semibold text-[#f6fbff] transition hover:border-[#50e6ed] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50e6ed]"
            >
              Acessar sistema
            </Link>
          </nav>
        </header>

        <main>
          <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32 lg:pt-28">
            <div className="max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#50e6ed]/25 bg-[#50e6ed]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#50e6ed]">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#50e6ed]" />
                Uma nova forma de atender e vender
              </p>
              <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl xl:text-7xl">
                {nome}
                <span className="mt-4 block text-[#50e6ed]">Seu atendimento pode ir muito além.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#bcd5e7]">
                Atendimento e vendas pelo WhatsApp, CRM e agentes de inteligência artificial em uma experiência mais conectada para o seu negócio.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={solicitarDemonstracao}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#50e6ed] px-6 py-3 text-sm font-bold text-[#0b2439] shadow-[0_15px_45px_rgba(80,230,237,0.18)] transition hover:bg-[#a2f5f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Quero conhecer o Omni <span aria-hidden="true" className="ml-2">↗</span>
                </a>
                <a
                  href="#recursos"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Explorar recursos
                </a>
              </div>
              <p className="mt-6 text-xs text-[#9eb9cf]">
                Solução personalizável para equipes que querem unir atendimento, relacionamento e operação.
              </p>
            </div>

            <div aria-label="Exemplo ilustrativo da central de atendimento" className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-[#50e6ed]/30 via-[#1588e8]/20 to-[#a497ff]/30 blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#9eb9cf]/20 bg-[#0b2439] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff969e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffc477]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#70c899]" />
                  </div>
                  <span className="text-xs font-medium tracking-widest text-[#9eb9cf]">CENTRAL OMNI</span>
                  <span className="h-2 w-2 rounded-full bg-[#50e6ed]" />
                </div>
                <div className="grid min-h-[380px] grid-cols-[120px_1fr] sm:grid-cols-[165px_1fr]">
                  <div className="border-r border-white/10 p-3 sm:p-4">
                    <div className="mb-5 h-2 w-16 rounded-full bg-[#50e6ed]/80" />
                    {["Conversas", "Contatos", "Funil", "Agenda"].map((item, index) => (
                      <div key={item} className={`mb-2 rounded-lg px-2 py-3 text-[11px] sm:text-xs ${index === 0 ? "bg-[#50e6ed]/15 text-[#50e6ed]" : "text-[#9eb9cf]"}`}>{item}</div>
                    ))}
                  </div>
                  <div className="space-y-5 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#9eb9cf]">Atendimento</p>
                        <p className="mt-1 text-sm font-semibold sm:text-base">Visão da equipe</p>
                      </div>
                      <span className="rounded-full bg-[#70c899]/15 px-2 py-1 text-[10px] font-semibold text-[#a1e2bf]">Em andamento</span>
                    </div>
                    <div className="rounded-xl border border-[#365a78] bg-[#122b48] p-3 sm:p-4">
                      <p className="mb-3 text-xs text-[#9eb9cf]">Nova conversa</p>
                      <div className="w-[82%] rounded-xl rounded-tl-sm bg-[#365a78] p-3 text-xs leading-relaxed text-[#f6fbff]">Olá! Gostaria de saber mais sobre os serviços.</div>
                      <div className="ml-auto mt-3 w-[88%] rounded-xl rounded-tr-sm bg-[#086ab7] p-3 text-xs leading-relaxed text-white">Claro! Vamos encontrar a melhor solução para você.</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#365a78] bg-[#122b48] p-3">
                        <span className="text-[10px] text-[#9eb9cf]">Próximo passo</span>
                        <p className="mt-2 text-xs font-semibold text-[#50e6ed]">Qualificação</p>
                      </div>
                      <div className="rounded-xl border border-[#365a78] bg-[#122b48] p-3">
                        <span className="text-[10px] text-[#9eb9cf]">Equipe</span>
                        <p className="mt-2 text-xs font-semibold">Humano + IA</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="border-t border-white/10 px-4 py-3 text-right text-[10px] text-[#9eb9cf]">
                  Representação ilustrativa da experiência
                </p>
              </div>
            </div>
          </section>

          <section id="recursos" className="border-y border-white/10 bg-[#0b2439]/70 px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#50e6ed]">Tudo conversa. Tudo evolui.</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Tecnologia para atender melhor e transformar conversas em oportunidades.
              </h2>
              <p className="mt-5 max-w-2xl text-[#bcd5e7]">O Omni reúne recursos de atendimento, CRM e automação em uma operação mais organizada.</p>
              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recursos.map((item) => (
                  <article key={item.numero} className="group rounded-2xl border border-white/10 bg-[#122b48]/80 p-7 transition hover:-translate-y-1 hover:border-[#50e6ed]/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#50e6ed]">{item.numero}</span>
                      <span className="h-2 w-2 rounded-full bg-[#a497ff]" />
                    </div>
                    <h3 className="mt-10 text-xl font-semibold">{item.titulo}</h3>
                    <p className="mt-3 min-h-24 text-sm leading-relaxed text-[#bcd5e7]">{item.descricao}</p>
                    <p className="mt-4 text-xs font-semibold text-[#50e6ed]">{item.destaque}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a497ff]">Na prática</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Mais clareza para o time. Mais continuidade para o cliente.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {passos.map((passo) => (
                <div key={passo.numero} className="border-t border-[#50e6ed]/50 pt-6">
                  <span className="text-3xl font-semibold text-[#50e6ed]">{passo.numero}</span>
                  <h3 className="mt-5 text-xl font-semibold">{passo.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#bcd5e7]">{passo.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="demonstracao" className="px-5 pb-24 sm:px-8">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#50e6ed]/20 bg-gradient-to-br from-[#122b48] via-[#0b416b] to-[#122b48] px-7 py-14 text-center sm:px-12 sm:py-20">
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#a497ff]/20 blur-3xl" />
              <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#50e6ed]">O próximo nível começa aqui</p>
              <h2 className="relative mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Pronto para descobrir o que o Omni pode fazer pela sua operação?
              </h2>
              <p className="relative mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#dfeefa] sm:text-base">
                Converse com a InfoHelp sobre os recursos, possibilidades de implantação e próximos passos.
              </p>
              <a href={solicitarDemonstracao} className="relative mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#50e6ed] px-7 py-3 text-sm font-bold text-[#0b2439] transition hover:bg-[#a2f5f7]">
                Solicitar apresentação <span aria-hidden="true" className="ml-2">↗</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-5 py-8 text-sm text-[#9eb9cf] sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-semibold text-[#f6fbff]">InfoHelp Omni</p>
              <p className="mt-1">Atendimento, CRM e automação em uma só direção.</p>
            </div>
            <nav aria-label="Links legais" className="flex flex-wrap gap-5">
              <Link href="/login" className="hover:text-white">Área do cliente</Link>
              <Link href="/legal/privacy" className="hover:text-white">Política de Privacidade</Link>
              <Link href="/legal/terms" className="hover:text-white">Termos de Uso</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
