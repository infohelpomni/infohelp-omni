# InfoHelp Omni 2.0 — Plano de personalização e implantação

> Estado: planejamento inicial. Este documento não é um procedimento de instalação executável.
> Base: fork de `melgarafael/DeskcommCRM`. Não alterar o núcleo nem publicar na VPS sem validação.

## Decisões confirmadas

- Produto: **InfoHelp Omni 2.0**.
- Domínio público planejado: `https://omni.infohelpsolucoes.com.br`.
- Administrador inicial (e-mail): `omni@infohelpsolucoes.com.br`.
- SMTP existente: `smtp.infohelpsolucoes.com.br`, porta `587`, STARTTLS. Usuário, senha e remetente ainda serão validados; **não colocar senhas no Git**.
- Supabase **self-hosted** com Auth, PostgreSQL, Realtime e Storage.
- Docker Engine + Docker Compose; Portainer opcional e não instalado inicialmente.
- Proxy HTTPS independente de Cloudflare; decisão sobre uso de Cloudflare pendente.
- Sem Grafana, Prometheus, Loki ou stack de monitoramento avançado na primeira implantação.
- Backups e restauração são requisitos essenciais desde a primeira instalação.
- Preservar todas as funcionalidades atuais do DeskComm; nenhuma redução de serviços sem análise de dependências e testes.
- Facebook/Instagram/Telegram: pesquisa e evolução futura, não bloqueiam o lançamento inicial.
- Manual completo de instalação, operação, atualização, recuperação e solução de problemas será entregue.

## Descobertas sobre a base original

1. `ubuntu-local-installer.sh` automatiza um ambiente **local/VM** e não é seguro assumir que suas URLs HTTP, portas e parâmetros são adequados para produção.
2. O kit `hostgator-setup-kit/` já oferece instalador de produção, atualização, backup, restauração e diagnóstico. Reutilizar os componentes comprovados antes de duplicar implementação.
3. A marca própria já é suportada via configuração de instalação (banco), com `APP_NAME`, `APP_LOGO_URL`, `APP_ACCENT_HEX` como sementes e recuperação. Não aplicar substituições globais de strings no código.
4. O sistema de e-mail da aplicação usa configuração SMTP separada do **Supabase Auth/GoTrue**. Ambos precisam de teste real.
5. O baseline do banco para instalação fresca é `supabase/baseline.sql`; não presumir que `supabase db push` cria o esquema integral.

## Próximas etapas

### Fase A — Auditoria (somente leitura)
- [ ] Comparar instalador local com `hostgator-setup-kit/install.sh`, `update.sh`, `backup.sh`, `restore.sh` e Compose de produção.
- [ ] Inventariar portas, redes, serviços indispensáveis, volumes e consumo mínimo para Supabase local.
- [ ] Confirmar as variáveis SMTP da aplicação e `GOTRUE_SMTP_*` do Auth self-hosted.
- [ ] Recuperar e conferir os arquivos **exatos** da nova logo e paleta InfoHelp antes de fixar valores.
- [ ] Auditar recursos atuais de canais sociais no código e em testes, sem prometer suporte não verificado.

### Fase B — Instalador exclusivo
- [ ] Projetar `install-infohelp-omni.sh` com preflight, entradas validadas e modo não interativo seguro.
- [ ] Definir URLs externas HTTPS e endpoints internos de rede Docker separadamente.
- [ ] Criar administrador com e-mail confirmado e senha fornecida de forma protegida ou gerada aleatoriamente.
- [ ] Configurar SMTP transacional e Auth; testar envio, confirmação e recuperação de senha.
- [ ] Evitar segredos em logs, argumentos, repositório e arquivos com permissões amplas.
- [ ] Adicionar diagnóstico, backup, restauração, atualização reversível e proteção contra sobrescrita.
- [ ] Manter redes e volumes isolados das outras aplicações da VPS.

### Fase C — Marca e validação
- [ ] Configurar marca da instalação e logos claro/escuro sem comprometer contratos técnicos existentes.
- [ ] Testar login, MFA, usuário inicial, todas as funções centrais, WhatsApp, filas, crons, mídia, e-mail e backup/restore.
- [ ] Executar os gates pertinentes: shell, unidade, TypeScript, banco/RLS, E2E e teste de instalação fresca.
- [ ] Publicar em produção **somente após aprovação**, com rollback documentado.

## Regras de colaboração

- Desenvolvimento em branch e revisão por Pull Request; não enviar mudanças diretamente para `main`.
- Não modificar o DeskComm de origem.
- Preservar licença MIT e avisos de direitos autorais exigidos.
- Nunca registrar credenciais reais, chaves Supabase, tokens WAHA ou SMTP em commits, issues ou PRs.
- Toda alteração posterior deve entrar no histórico técnico, nos testes correspondentes e no manual operacional.
- Não contratar ou dimensionar definitivamente a VPS antes da análise dos serviços e carga esperada.
