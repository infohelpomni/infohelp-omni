# Publicação de imagens próprias — bloqueador de deploy do InfoHelp Omni 2.0

> Estado em 29/10/2026: **pendente**. Esta é uma dependência de lançamento, não uma etapa que se resolve configurando DNS ou contratando a VPS.

## Achado confirmado no código

O fork personaliza o fonte, o SQL inicial e o wrapper de instalação, mas o kit original define `IMG_NS="ghcr.io/melgarafael"` em `hostgator-setup-kit/_common.sh` e calcula as imagens `APP_IMAGE`, `WORKER_IMAGE` e `SCHEDULER_IMAGE` a partir das releases do upstream em `hostgator-setup-kit/install.sh`.

**Efeito:** executar um instalador customizado que baixa essas imagens pode instalar o **DeskComm original** em vez dos componentes compilados a partir do fork. Cor no `.env` e SQL de organização não substituem a interface personalizada nem novas funcionalidades no bundle.

## Objetivo

Uma release Omni deve publicar um conjunto coerente e rastreável:

- `ghcr.io/infohelpomni/infohelp-omni-app:<versao>`
- `ghcr.io/infohelpomni/infohelp-omni-worker:<versao>`
- `ghcr.io/infohelpomni/infohelp-omni-scheduler:<versao>`

Os nomes acima são **propostos**, não são imagens já publicadas. A mesma tag (ou digest identificado) deve ser usada nas três partes.

## Etapas sem VPS

1. Inspecionar o workflow existente de build/push e as permissões do GitHub Actions para publicação no GHCR da organização `infohelpomni`.
2. Adaptar o build para **três imagens** e mesma revisão de código. Não introduzir `docker build` automático na VPS do cliente.
3. Adaptar as constantes de repositório de imagens e resolução de releases do kit do fork, sem alterar a instalação do Supabase oficial.
4. Definir uma versão Omni (ex.: `v2.0.0-rc.1`), política de rollback e as tags aceitas pelo resolvedor. Não assumir que o formato de versão do upstream aceita prerelease.
5. Validar por digest as três imagens e arquitetura `linux/amd64` (AlphaVPS Sofia, a confirmar por `uname -m`) antes de permitir deploy.
6. Fazer `docker compose config` e smoke tests de app, worker e scheduler, além de preservar todos os testes do DeskComm.
7. Instalação e teste de restauração em VPS limpa; somente então aprovar merge/produção.

## Critérios de aprovação da instalação

- [ ] Nenhum serviço Omni exige imagem privada ou do namespace `melgarafael`.
- [ ] A versão do app corresponde à dos workers e do scheduler.
- [ ] Imagens GHCR públicas ou com autenticação de pull provisionada **sem segredos no git**.
- [ ] Instalador não faz fallback silencioso para o DeskComm original.
- [ ] Branding, administração inicial, SMTP e recuperação de senha comprovados.
- [ ] `update.sh` e rollback usam releases Omni, e não retornam ao DeskComm original.
- [ ] Banco e storage mantêm compatibilidade; nenhuma funcionalidade de DeskComm é removida.

## Operação e múltiplos serviços na VPS

A AlphaVPS será compartilhada com outras aplicações. A reserva de 80/443 precisa ser única para o proxy reverso da máquina; cada novo serviço recebe rede e hostname próprios. O kit já dispõe de alternativas com Traefik, mas a decisão do proxy da VPS precisa ser fechada quando soubermos que serviços estarão nela. **Não publicar portas de Postgres/Redis/WAHA indiscriminadamente.**

## Regra temporária de segurança

**Não executar `bash install-infohelp-omni.sh --install` na VPS definitiva antes de o conjunto de imagens Omni existir e do instalador ser atualizado para usá-lo.** O `--check` continua apropriado para diagnóstico. O manual operacional e a PR devem manter este bloqueio explícito até sua remoção com evidências.
