# Auditoria inicial — instalador InfoHelp Omni 2.0

Data: 2026-10-29. Escopo: leitura do fork antes de qualquer alteração funcional.

## Conclusão

**Base escolhida:** `hostgator-setup-kit/install-single-server.sh`, integrada ao `hostgator-setup-kit/install.sh` e ao Compose de produção.

**Base rejeitada para produção:** `ubuntu-local-installer.sh` (fluxo de desenvolvimento/VM baseado no Supabase CLI, URLs HTTP e IP local).

O kit single-server já sobe Supabase self-hosted e app na mesma VPS, com Caddy HTTPS, Postgres 17, Auth, REST, Realtime, Storage, worker, scheduler, WAHA e Redis/SRH. Ele documenta piso de 4 GB e recomenda 8 GB; o tamanho final deve ser validado sob carga.

## Achados concretos

1. **Admin inicial:** `install-single-server.sh` usa `admin@DOMINIO` na instalação fresca, guarda login/senha em `.runtime/admin-credentials` e delega a criação ao `scripts/bootstrap-owner.ts`. Ajustar para `omni@infohelpsolucoes.com.br` de forma configurável, preservando idempotência e sem expor senha nos logs.
2. **Risco na reexecução:** `bootstrap-owner.ts` atualiza a senha de usuário existente. Testar cuidadosamente o comportamento de segunda execução antes de oferecer instalador idempotente.
3. **SMTP:** `install-single-server.sh` já chama `sincronizar_smtp_do_gotrue` após instalar a aplicação. O CRM pode receber SMTP pelo painel Admin → E-mail; o sincronismo para GoTrue ocorre no instalador e no `update.sh`. Para instalação automática, provisionar SMTP do CRM **antes** da sincronização e verificar formato/autorização; nunca gravar credenciais no repositório.
4. **Domínio:** o single-server usa um único domínio HTTPS para app e rotas Supabase via `Caddyfile.single-server`. Configurar `omni.infohelpsolucoes.com.br`. Não servir apenas a interface Next: `/auth/v1`, `/rest/v1`, Realtime e Storage precisam chegar ao gateway.
5. **Proxy:** `REVERSE_PROXY=cloudflared` é recusado no modo single-server, pois desligaria o Caddy que também publica as APIs Supabase. O caminho seguro inicial é Caddy próprio e DNS convencional, com decisão Cloudflare posterior. Preservar a possibilidade de Traefik já suportada pelo kit.
6. **VPS compartilhada:** a stack já dispõe de projeto Compose e redes próprias. Inspecionar nomes de portas/rede Caddy e conflitos com outras aplicações antes de oferecer proxy compartilhado; só um processo publica 80/443 na máquina.
7. **Imagem:** o kit de produção usa imagens pré-construídas. Para personalização que altere código de aplicação, precisaremos de pipeline de build e imagens próprias, ou configurar marca em runtime quando suficiente. O `update.sh` upstream pode reescrever `APP_IMAGE`; não chamá-lo sem adaptar a política de imagens.
8. **Marca:** `docs/white-label.md` descreve `APP_NAME`, `APP_ACCENT_HEX`, logos claro/escuro, CSS personalizado e resolução por banco. Utilizar primeiro o mecanismo existente, mantendo licença e contratos técnicos.
9. **Esquema:** instalação fresca aplica `supabase/baseline.sql`, não confiar em migrations históricas isoladas.
10. **Testes existentes:** há `pnpm test:shell`, testes DB/RLS e E2E. Toda alteração no instalador exigirá testes de instalação limpa, segunda execução, SMTP/recuperação de senha e restauração.

## Primeira entrega de implementação proposta

- Criar um pequeno ponto de entrada `install-infohelp-omni.sh` que valide requisitos, domínio, SMTP e administrador, e use o kit single-server sem duplicá-lo.
- Adaptar a escolha do e-mail do primeiro dono mantendo o segredo gerado e protegido.
- Alimentar SMTP em configuração privada, sincronizar GoTrue/Auth e validar envio real.
- Criar scripts operacionais `omni` (status/logs/backup/update/diagnóstico) como interface amigável sobre o kit existente.
- Restringir alterações ao fork e a branches revisáveis; nunca aplicar diretamente na VPS sem testes.

## Pendências

- Recuperar logo e paleta exatas, e definir nome final da organização inicial.
- Confirmar **usuário SMTP** e **remetente autorizado** (não enviar senhas no chat nem no Git).
- Definir capacidade mínima real da VPS e expectativa de sessões WhatsApp simultâneas.
- Verificar viabilidade de um domínio único para Omni e Supabase com os serviços adicionais da VPS.
- Auditar implementação atual dos canais Instagram, Facebook Messenger e Telegram após estabilizar o instalador.

## Política de aceite

Não afirmar que o Omni preserva 100% das funções apenas porque o stack sobe. Validar autenticação, MFA, CRM, inbox, WhatsApp, filas, agentes IA, mídia, automações, canais, e-mails, backup e restauração contra testes do fork antes de liberar o deploy.

## Progresso — 2026-10-29

- Hospedagem planejada: **AlphaVPS C16G**, 6 vCPU, 16 GB RAM, 140 GB NVMe, 12 TB mensais; localidade apresentada: **Sofia, Bulgária**. Medir latência real do Brasil e verificar política de backups.
- Organização confirmada: **InfoHelp - Omni**. O SQL do instalador de produção ainda cria literalmente a organização `Minha Empresa` com slug `minha-empresa`; corrigir sem afetar instalações existentes.
- SMTP inicial previsto: `omni@infohelpsolucoes.com.br` em `smtp.infohelpsolucoes.com.br:587` STARTTLS; usuário e remetente devem ser validados sem divulgar senha.
- Utilitário criado: `bash scripts/omni-preflight.sh`, somente leitura, com verificações de Ubuntu, RAM, CPU, disco, arquitetura, ferramentas e portas 80/443. Ainda não foi executado numa VPS real.
