# InfoHelp Omni 2.0 — Manual operacional inicial

> **Rascunho em validação — instalação bloqueada:** o kit ainda resolve imagens Docker do DeskComm original. **Não execute `--install` na VPS definitiva** até que a publicação das três imagens Omni e a atualização do instalador estejam prontas. Ver [Estratégia de build e release](ESTRATEGIA-BUILD-E-RELEASE.md).
>
> Origem: fork `infohelpomni/infohelp-omni`. Instalação planejada: AlphaVPS C16G, Sofia, Bulgária, Ubuntu Server 24.04 LTS.

## Dados definidos

| Campo | Valor |
|---|---|
| Aplicação | InfoHelp Omni |
| Organização | InfoHelp - Omni |
| Administrador inicial | omni@infohelpsolucoes.com.br |
| Domínio público | omni.infohelpsolucoes.com.br |
| Servidor de envio | smtp.infohelpsolucoes.com.br |
| Porta e segurança | 587, STARTTLS |
| Infraestrutura | Docker Compose, Supabase self-hosted, Caddy HTTPS |
| Interface Docker | Portainer opcional, não incluído inicialmente |

## Antes de instalar

1. Confirmar acesso SSH por **chave pública**; restringir autenticação por senha apenas depois de testar um segundo acesso.
2. Confirmar IP público, versão Ubuntu e se a VPS fornece IPv4 e IPv6.
3. Configurar DNS A de `omni.infohelpsolucoes.com.br` para o IPv4 da VPS. Decisão Cloudflare pode vir depois; não é obrigatório.
4. Verificar portas 80/443, política de firewall e se já existe proxy de outras aplicações.
5. Planejar backup **fora da VPS**. Snapshot do provedor não substitui backup testado.
6. Não copiar credenciais SMTP, tokens ou chaves para GitHub, issues, logs ou conversas.

## Diagnóstico de leitura (após homologação do script)

Na raiz do clone da branch aprovada:

```bash
bash install-infohelp-omni.sh --check
```

Esse modo apenas observa recursos e portas. O resultado com aviso não equivale a instalação pronta.

## Instalação futura (ainda bloqueada para produção)

```bash
bash install-infohelp-omni.sh --install
```

O comando exige que o operador digite `INSTALAR`. Ele delega a execução ao kit single-server e cria contêineres, redes, banco e volumes. Não execute em uma VPS que já possua outras aplicações sem conferir as portas e o proxy.

## SMTP do aplicativo e do Supabase

Há **dois fluxos** distintos:

1. Aplicação Omni: convites e mensagens transacionais; o projeto suporta SMTP pela tela **Admin → E-mail**, com teste de conexão.
2. Supabase Auth (GoTrue): recuperação de senha, confirmação de cadastro e convites de autenticação. No modo single-server, o kit possui `sincronizar_smtp_do_gotrue`.

Procedimento provisório após a primeira instalação:

1. Abrir `https://omni.infohelpsolucoes.com.br/admin/email` com o proprietário.
2. Preencher host `smtp.infohelpsolucoes.com.br`, porta `587`, segurança `STARTTLS`, nome e endereço do remetente autorizados, login e senha reais **na interface HTTPS**.
3. Usar **Testar conexão**. Se falhar, verificar credenciais, DNS, egress TCP 587 e restrições do provedor.
4. Executar `bash hostgator-setup-kit/update.sh` no diretório da instalação para sincronizar a configuração com o GoTrue. O script pode também executar outras ações de atualização: fazer backup e revisar a versão antes.
5. Validar duas jornadas completas em contas de teste: convite e recuperação de senha. Confirmar que os links apontam para o domínio público, e não para `localhost`.

A captura do SMTP **durante** a instalação ainda não está pronta. Não declarar esse requisito concluído.

## Comandos Docker úteis

Na raiz do repositório, o kit de produção usa múltiplos arquivos Compose/overlays conforme o proxy e o modo single-server. Para evitar usar uma combinação errada, preferir inicialmente os scripts do kit e as funções de status documentadas no README. Não aplicar `docker compose down -v`: isso remove dados persistentes.

## Backup e restauração

- `hostgator-setup-kit/backup.sh`: consultar opções e testar sem retirar produção do ar.
- `hostgator-setup-kit/restore.sh`: ensaiar restauração em ambiente separado antes de depender dos backups.
- Nunca manter a única cópia dos dados ou sessões WhatsApp no mesmo disco da VPS.
- Registrar data, tamanho, integridade e resultado de cada ensaio de recuperação.

## Problemas típicos

| Sintoma | Primeiro diagnóstico |
|---|---|
| Domínio não abre | DNS A, firewall TCP 80/443, logs Caddy |
| Login/recuperação falha | Rota pública `/auth/v1`, GoTrue, site URL e templates |
| Convite não chega | SMTP em Admin → E-mail, teste de envio e sincronização com GoTrue |
| WhatsApp não conecta | Logs WAHA, sessão, webhooks e rede Docker |
| App com erro de banco | Healthcheck, PostgreSQL, baseline e rede privada |
| Serviço não inicia | `docker compose ps`, logs específicos e volumes livres |
| Atualização falha | Verificar backup anterior e documentação de rollback; não apagar volumes |

## Validações confirmadas em VPS (30/10/2026)

A pessoa responsável executou no servidor Ubuntu 24.04.2 (AlphaVPS C16G):

- Docker Engine 29.9.2 e Docker Compose v5.6.1: `hello-world` executou normalmente.
- UFW ativo com 22/80/443 TCP liberadas; SSH com chave pública e usuário `omniops` com `sudo`.
- Configuração Docker `daemon.json` validada e driver de logs `local` confirmado.
- Fork clonado em `/opt/infohelp-omni` na branch `infohelp/planejamento-instalador-v1`.
- `bash install-infohelp-omni.sh --check`: **0 erros e 0 avisos**.
- `bash tests/shell/infohelp-omni-bootstrap.test.sh`: **OK**.
- DNS do Omni respondeu com IPs da Cloudflare; validar destino do registro antes da troca de tráfego.

Essas provas são de **infraestrutura e sintaxe/contratos estáticos**. Não equivalem a `pnpm test:shell`, E2E, testes RLS nem instalação em produção. O workflow `.github/workflows/omni-preflight.yml` agora executa o bootstrap também nos runners do GitHub; verificar seu resultado na interface Actions.

## Pendências antes da publicação

- [ ] Publicar e pinçar imagens Omni próprias (app, worker, scheduler), com validação de digest e rollback no mesmo namespace.

- [x] Executar bootstrap Omni e análise sintática na VPS.
- [ ] Executar a suíte shell **completa**, typecheck, unitários e E2E.
- [ ] Verificar instalação fresca e segunda execução.
- [ ] Confirmar administrador e organização corretos no banco.
- [ ] Validar SMTP com endereço e credenciais reais em canal seguro.
- [ ] Testar login, MFA, WhatsApp, filas, anexos, integrações e backup/restore.
- [ ] Validar tempo de resposta de Sofia com usuários no Brasil.
- [ ] Revisar logo e paleta oficiais e homologar interface clara/escura.
