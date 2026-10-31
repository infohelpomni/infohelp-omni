# InfoHelp Omni — landing de vendas e acesso

Data: 30/10/2026. Estado: implementação no fork, pendente homologação visual/E2E.

## URLs

| URL | Finalidade |
|---|---|
| `https://omni.infohelpsolucoes.com.br/` | Landing comercial pública para visitantes sem sessão |
| `https://omni.infohelpsolucoes.com.br/login` | Login do sistema; preserva Google, convites, recuperação e MFA |
| `https://omni.infohelpsolucoes.com.br/app` | Área autenticada; visitantes sem sessão seguem autenticação existente |
| `/legal/privacy` e `/legal/terms` | Documentos legais públicos, linkados no rodapé |

O visitante autenticado que abrir `/` continua sendo encaminhado para `/app` via `supabase.auth.getUser()` (não `getSession()`).

## Experiência implementada

- Header com logo InfoHelp Omni e acesso rápido ao sistema.
- Hero com proposta comercial, CTA principal, CTA secundário e ilustração declaradamente fictícia da interface.
- Seções de recursos: atendimento, CRM, IA com handoff, agenda, rastreabilidade e self-host.
- Passos simples para explicar a adoção.
- CTA de apresentação e links legais.
- Layout responsivo com identidade exata da marca (ciano, azul e violeta) e foco de teclado.
- Login com card visual, frase de acolhimento e volta à landing, preservando os componentes de autenticação originais.
- Logo estático oficial somente como **fallback** quando a marca resolvida é exatamente `InfoHelp Omni` e nenhum logo foi configurado no banco. Logo de outra instalação/organização continua prioritário.

## Contato comercial temporário

Enquanto não houver telefone comercial ou CRM de captura definido, os CTAs geram um e-mail para `omni@infohelpsolucoes.com.br` com assunto e texto de solicitação.

**A confirmar antes de publicar anúncios:** o canal definitivo de vendas (WhatsApp Business comercial, formulário com antispam ou agendamento de demonstração). O endereço usado atualmente é o administrador inicial, não foi informado como canal de vendas. Não anunciar campanhas pagas antes de substituir/validar esse destino.

## Regras de verdade publicitária

Não foram inventados números de aumento de vendas, depoimentos, marcas clientes, planos ou preços. A disponibilidade das integrações varia com configurações e credenciais de cada instalação; copy usa linguagem condicional quando pertinente.

## Testes ainda exigidos

- [x] Código de landing e login aplicado no fork.
- [x] Teste unitário/estático cobrindo CTA, links legais, redirecionamento e permanência de fluxos de login.
- [ ] Executar `pnpm test:unit`, `pnpm typecheck` e `pnpm lint`.
- [ ] Validar visualmente em 360/390/768/1440px nos dois temas.
- [ ] Testar `/` sem sessão e `/` autenticado.
- [ ] Testar login normal, recuperação de senha, convite, Google e MFA.
- [ ] Testar acessibilidade de contraste, foco e leitura por tecnologia assistiva.
- [ ] Confirmar destino comercial e adicionar mensuração consentida/compatível com LGPD antes de tráfego pago.
- [ ] Testar comportamento atrás de Cloudflare e cache de páginas públicas, sem armazenar HTML de sessão.

## Arquivos

- `components/marketing/OmniLanding.tsx`
- `app/page.tsx`
- `app/(public)/login/page.tsx`
- `app/(public)/layout.tsx`
- `public/brand/omni-logo-white.svg` e `public/brand/omni-logo-dark.svg`
- `app/page.test.tsx`, `tests/unit/infohelp-omni-marketing.test.ts`
