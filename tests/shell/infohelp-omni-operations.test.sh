#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")/../.."
bash -n omni.sh
bash -n install-infohelp-omni.sh
bash -n hostgator-setup-kit/install.sh
bash -n hostgator-setup-kit/install-single-server.sh
bash omni.sh --help | grep -q 'smtp-sync'
bash omni.sh --help | grep -q 'backup-schedule'
grep -q 'docker-compose.google.yml' hostgator-setup-kit/install-single-server.sh
! grep -q 'lp-comunidade.automatiklabs.com.br' hostgator-setup-kit/install.sh
! grep -q 'DESKCOMM"' hostgator-setup-kit/install.sh
! grep -q '$(t "recomeçar:")' hostgator-setup-kit/install.sh
echo 'OK: InfoHelp Omni operations'
