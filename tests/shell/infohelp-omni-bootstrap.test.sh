#!/usr/bin/env bash
# Protege as decisões de bootstrap da instalação nova do InfoHelp Omni.
# Verificações estáticas; o teste de instalação real será feito numa VPS limpa.
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

grep -Fq 'owner_email="${OMNI_OWNER_EMAIL:-omni@infohelpsolucoes.com.br}"' hostgator-setup-kit/install-single-server.sh
grep -Fq 'set_env_var "$app_env" APP_NAME "InfoHelp Omni"' hostgator-setup-kit/install-single-server.sh
grep -Fq 'APP_ACCENT_HEX "${omni_accent:-#086AB7}"' hostgator-setup-kit/install-single-server.sh
grep -Fq "where slug='infohelp-omni'" hostgator-setup-kit/install.sh
grep -Fq "'InfoHelp - Omni','InfoHelp - Omni'" hostgator-setup-kit/install.sh
grep -Fq 'sincronizar_smtp_do_gotrue' hostgator-setup-kit/install-single-server.sh
# Publicação, atualização e rollback devem apontar ao fork, nunca às imagens upstream.
grep -Fq 'IMG_NS="ghcr.io/' hostgator-setup-kit/_common.sh
grep -Fq 'REPO_URL="${REPO_URL:-https://github.com/infohelpomni/infohelp-omni.git}"' hostgator-setup-kit/install.sh
if grep -Fq 'IMG_NS="ghcr.io/melgarafael"' hostgator-setup-kit/_common.sh; then
  printf 'ERRO: instalação continua apontando às imagens do DeskComm original.\n' >&2
  exit 1
fi
bash -n hostgator-setup-kit/install-single-server.sh
bash -n hostgator-setup-kit/install.sh
bash -n hostgator-setup-kit/_common.sh
bash -n scripts/omni-preflight.sh
bash -n install-infohelp-omni.sh
grep -Fq 'exec bash "$ROOT_DIR/hostgator-setup-kit/install-single-server.sh"' install-infohelp-omni.sh
# O gate de publicação precisa vir ANTES do primeiro script de instalação.
grep -Fq 'OMNI_RELEASE_API="https://api.github.com/repos/infohelpomni/infohelp-omni/releases/latest"' install-infohelp-omni.sh
grep -Fq 'trio_publicado "$versao"' install-infohelp-omni.sh
grep -Fq 'verificar_imagens_omni || exit 1' install-infohelp-omni.sh
grep -Fq 'export REPO_URL="https://github.com/infohelpomni/infohelp-omni.git"' install-infohelp-omni.sh

# Testa apenas a CLI sem abrir a instalação ou acessar Docker.
bash install-infohelp-omni.sh --help | grep -Fq -- '--check'
if bash install-infohelp-omni.sh --opcao-invalida >/dev/null 2>&1; then
  printf 'ERRO: opção inválida foi aceita.\n' >&2
  exit 1
fi
if bash install-infohelp-omni.sh --install --domain >/dev/null 2>&1; then
  printf 'ERRO: --domain sem valor foi aceito.\n' >&2
  exit 1
fi

printf 'OK: bootstrap Omni, sincronização SMTP existente e sintaxe shell conferidos.\n'
