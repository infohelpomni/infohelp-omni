# InfoHelp Omni 2.0 — Manual operacional inicial

> **Rascunho em validação:** comandos de instalação só devem ser executados após homologação da branch e aprovação. Não usar esta versão como guia de produção ainda.
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

## Pendências antes da publicação

- [ ] Executar testes de shell e análise sintática.
- [ ] Verificar instalação fresca e segunda execução.
- [ ] Confirmar administrador e organização corretos no banco.
- [ ] Validar SMTP com endereço e credenciais reais em canal seguro.
- [ ] Testar login, MFA, WhatsApp, filas, anexos, integrações e backup/restore.
- [ ] Validar tempo de resposta de Sofia com usuários no Brasil.
- [ ] Revisar logo e paleta oficiais e homologar interface clara/escura.
