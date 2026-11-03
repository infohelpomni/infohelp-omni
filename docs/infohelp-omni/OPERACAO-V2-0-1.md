# InfoHelp Omni 2.0.1 — Operação e manutenção

## Estado comprovado
- VPS: Ubuntu 24.04, /opt/infohelp-omni, produção v2.0.0.
- 18 contêineres rodando, incluindo App, Auth, Postgres, worker e scheduler.
- Login Google testado. Segredos ficam exclusivamente na VPS.
- SMTP Auth presente; envio real deve ser testado.
- Cron de agente ativo a cada cinco minutos; backup diário ainda não confirmado.
- Backup inicial de 03/11/2026 em /opt/backups: SQL, WAHA e Storage.
- Restauração e cópia externa continuam pendentes.

## Comandos disponíveis após publicar e instalar esta versão

```bash
cd /opt/infohelp-omni
bash omni.sh --help
bash omni.sh status
sudo bash omni.sh backup
sudo bash omni.sh backup-check
sudo bash omni.sh smtp-sync
sudo bash omni.sh backup-schedule
```

O smtp-sync lê SMTP em Admin > E-mail, atualiza GoTrue e recria apenas o contêiner Auth. Nunca transmite credenciais pelo terminal. Verifique recuperação de senha em conta de teste depois.

O backup-schedule agenda diariamente 06:00 UTC (03:00 Brasília) em /etc/cron.d/infohelp-omni-backup; recusa duplicar linha existente no crontab root. Confira também possíveis agendas em outros arquivos de cron.

Execute bash omni.sh update somente após revisar a release, confirmar backup recuperável e ter uma cópia criptografada fora da VPS. A atualização preserva as verificações do kit original.

## Preservação do Google OAuth

O arquivo local .runtime/supabase/docker-compose.google.yml é incluído no COMPOSE_FILE quando existir. Ele deve continuar junto do .runtime/supabase/.env com GOOGLE_ENABLED, GOOGLE_CLIENT_ID e GOOGLE_SECRET privados. Nunca versionar esses dados.

Se o OAuth consent screen estiver em modo Testing no Google, apenas testadores autorizados podem entrar. A passagem ao modo Production é separada da configuração técnica.

## Segurança e recuperação

- Nunca executar docker compose down -v no host de produção.
- Backups contêm dados de clientes e sessões do WhatsApp. Guardar com permissão restrita, criptografia e cópia fora da VPS.
- Retenção do script: últimos 14 arquivos por tipo. Validar gzip -t e tar -tzf, mas testes de restauração devem ocorrer em ambiente isolado.
- O Storage de 108 bytes pode estar vazio numa instalação nova: validar anexos reais posteriormente.

## Checklist para liberar 2.0.1

- [ ] Shell tests e testes funcionais essenciais passaram.
- [ ] Imagens InfoHelp Omni publicadas e verificadas.
- [ ] Backup externo e simulação de restore concluídos.
- [ ] Login Google e recuperação de senha funcionam após atualização.
- [ ] Mensagens e logs personalizados sem publicidade do upstream.
- [ ] Cron de backup único, com logs e acompanhamento de falhas.
- [ ] Atendimento WhatsApp, filas, tickets, anexos e permissões homologados.
