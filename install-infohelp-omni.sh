#!/usr/bin/env bash
# InfoHelp Omni 2.0 — ponto de entrada do instalador single-server.
# Personalizações no kit são mantidas no fork; não execute o upstream diretamente.
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
DEFAULT_DOMAIN="omni.infohelpsolucoes.com.br"
OMNI_RELEASE_API="https://api.github.com/repos/infohelpomni/infohelp-omni/releases/latest"

# O kit do DeskComm tolera falta de release e pode cair em :latest ou build local.
# Para uma instalação Omni NOVA isso seria regressão de marca. Recuse antes de
# criar volumes, banco, redes e credenciais. Lê somente GitHub/GHCR.
verificar_imagens_omni() {
  local resposta tag versao
  command -v curl >/dev/null 2>&1 || { printf 'curl é necessário para verificar a release Omni.\n' >&2; return 1; }
  resposta="$(curl -fsSL --max-time 15 -H 'Accept: application/vnd.github+json' "$OMNI_RELEASE_API" 2>/dev/null)" || {
    printf 'Não foi possível consultar a última release Omni no GitHub. Instalação bloqueada.\n' >&2
    return 1
  }
  tag="$(printf '%s' "$resposta" | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
  if ! [[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    printf 'Ainda não existe uma release estável Omni (vX.Y.Z). Instalação bloqueada.\n' >&2
    return 1
  fi
  versao="${tag#v}"
  # O mesmo resolvedor do kit verifica app, worker, scheduler e voice-agent.
  # Não confiar em versões publicadas pelo upstream.
  # shellcheck source=hostgator-setup-kit/_common.sh
  source "$ROOT_DIR/hostgator-setup-kit/_common.sh"
  if ! trio_publicado "$versao"; then
    printf 'Release Omni %s encontrada, mas as quatro imagens públicas não estão prontas em %s.\n' "$tag" "$IMG_NS" >&2
    return 1
  fi
  printf 'Release Omni validada: %s (%s).\n' "$tag" "$IMG_NS"
}

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
    verificar_imagens_omni || exit 1
    bash "$ROOT_DIR/scripts/omni-preflight.sh" || {
      printf 'Pré-requisitos não atendidos; instalação interrompida.\n' >&2
      exit 1
    }
    printf '\nInstalação do InfoHelp Omni 2.0 em %s.\n' "$domain"
    printf 'O processo criará containers, redes, volumes e dados no servidor.\n'
    read -r -p 'Digite INSTALAR para confirmar: ' answer
    [[ "$answer" == "INSTALAR" ]] || { printf 'Operação cancelada.\n'; exit 0; }
    export OMNI_OWNER_EMAIL="omni@infohelpsolucoes.com.br"
    export REPO_URL="https://github.com/infohelpomni/infohelp-omni.git"
    exec bash "$ROOT_DIR/hostgator-setup-kit/install-single-server.sh" --domain "$domain"
    ;;
  *) usage >&2; exit 2 ;;
esac
