#!/usr/bin/env bash
# InfoHelp Omni 2.0 — ponto de entrada do instalador single-server.
# Personalizações no kit são mantidas no fork; não execute o upstream diretamente.
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
DEFAULT_DOMAIN="omni.infohelpsolucoes.com.br"

usage() {
  cat <<'USAGE'
Uso:
  bash install-infohelp-omni.sh --check
  bash install-infohelp-omni.sh --install [--domain DOMINIO]

--check   Verifica recursos sem alterar o servidor.
--install Executa o kit single-server do fork (requer confirmação explícita).
A configuração SMTP completa ainda é feita na interface Admin > E-mail,
seguida da sincronização com o GoTrue pelo update.sh. Não envie senhas por chat.
USAGE
}

action=""
domain="$DEFAULT_DOMAIN"
while (($#)); do
  case "$1" in
    --check|--install)
      [[ -z "$action" ]] || { usage >&2; exit 2; }
      action="$1"
      ;;
    --domain)
      shift
      (($#)) || { usage >&2; exit 2; }
      domain="$1"
      ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
  shift
done

case "$action" in
  --check)
    bash "$ROOT_DIR/scripts/omni-preflight.sh"
    ;;
  --install)
    [[ "$domain" =~ ^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)+$ ]] \
      || { printf 'Domínio inválido.\n' >&2; exit 2; }
    bash "$ROOT_DIR/scripts/omni-preflight.sh" || {
      printf 'Pré-requisitos não atendidos; instalação interrompida.\n' >&2
      exit 1
    }
    printf '\nInstalação do InfoHelp Omni 2.0 em %s.\n' "$domain"
    printf 'O processo criará containers, redes, volumes e dados no servidor.\n'
    read -r -p 'Digite INSTALAR para confirmar: ' answer
    [[ "$answer" == "INSTALAR" ]] || { printf 'Operação cancelada.\n'; exit 0; }
    export OMNI_OWNER_EMAIL="omni@infohelpsolucoes.com.br"
    exec bash "$ROOT_DIR/hostgator-setup-kit/install-single-server.sh" --domain "$domain"
    ;;
  *) usage >&2; exit 2 ;;
esac
