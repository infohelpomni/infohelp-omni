#!/usr/bin/env bash
# InfoHelp Omni — operações em instalações existentes. Não recria volumes.
set -Eeuo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
InfoHelp Omni — manutenção
  bash omni.sh status          Estado dos contêineres
  bash omni.sh backup          Backup completo em /opt/backups (ou BACKUP_DIR)
  bash omni.sh smtp-sync       Sincroniza SMTP Admin → E-mail com Supabase Auth
  bash omni.sh update          Executa atualização oficial com verificações
  bash omni.sh backup-schedule Agenda backup diário às 06:00 UTC (03:00 Brasília)
  bash omni.sh backup-check    Confere existência/integridade dos backups locais
Credenciais permanecem nos arquivos privados da instalação. Não as cole em logs.
EOF
}
require_install() {
  [ -f .env ] || { echo "Instalação não encontrada (.env ausente)." >&2; exit 1; }
}
check_identity() {
  # Funções de segurança do kit original: evitam atuar sobre outra instalação.
  # shellcheck source=hostgator-setup-kit/_common.sh
  source "$ROOT_DIR/hostgator-setup-kit/_common.sh"
  enter_project
  recusar_projeto_de_outra_arvore || { echo "Projeto pertence a outra árvore." >&2; exit 1; }
  if [ "${SINGLE_SERVER:-0}" = 1 ]; then
    recusar_supabase_de_outra_arvore || { echo "Supabase pertence a outra árvore." >&2; exit 1; }
  fi
}
case "${1:-}" in
  status)
    docker ps --filter "label=com.docker.compose.project=infohelp-omni" --format 'table {{.Names}}\t{{.Status}}'
    ;;
  backup)
    require_install
    export BACKUP_DIR="${BACKUP_DIR:-/opt/backups}"
    exec bash "$ROOT_DIR/hostgator-setup-kit/backup.sh"
    ;;
  backup-check)
    backup_dir="${BACKUP_DIR:-/opt/backups}"
    if [ ! -d "$backup_dir" ]; then echo "Diretório inexistente: $backup_dir" >&2; exit 1; fi
    shopt -s nullglob
    dbs=("$backup_dir"/db-*.sql.gz)
    if (("${#dbs[@]}" == 0)); then echo "Nenhum backup SQL encontrado." >&2; exit 1; fi
    failed=0
    for file in "${dbs[@]}"; do
      if gzip -t "$file"; then echo "OK: $(basename "$file")"; else echo "ERRO: $file" >&2; failed=1; fi
    done
    exit "$failed"
    ;;
  smtp-sync)
    require_install
    check_identity
    [ "${SINGLE_SERVER:-0}" = 1 ] || { echo "SMTP Sync requer Supabase self-hosted." >&2; exit 1; }
    if sincronizar_smtp_do_gotrue; then
      echo "Configuração SMTP sincronizada. Aplicando ao Auth..."
      dc_supabase up -d --no-deps auth >/dev/null
      echo "OK. Confirme o envio real por recuperação de senha."
    else
      echo "SMTP/Resend não configurado no Omni. Configure em Admin → E-mail." >&2
      exit 1
    fi
    ;;
  update)
    require_install
    exec bash "$ROOT_DIR/hostgator-setup-kit/update.sh"
    ;;
  backup-schedule)
    require_install
    [ "$(id -u)" -eq 0 ] || { echo "Execute: sudo bash omni.sh backup-schedule" >&2; exit 1; }
    command -v crontab >/dev/null 2>&1 || { echo "Instale cron antes de agendar." >&2; exit 1; }
    if crontab -l 2>/dev/null | grep -Eq 'hostgator-setup-kit/backup.sh|omni.sh backup'; then
      echo "Já existe agendamento de backup no crontab de root. Revise antes de duplicar." >&2
      exit 1
    fi
    file=/etc/cron.d/infohelp-omni-backup
    if [ -e "$file" ]; then echo "Agendamento já existe: $file"; exit 0; fi
    tmp="$(mktemp)"
    trap 'rm -f "$tmp"' EXIT
    printf '%s\n' 'SHELL=/bin/bash' 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'       '0 6 * * * root cd /opt/infohelp-omni && BACKUP_DIR=/opt/backups bash omni.sh backup >> /var/log/infohelp-omni-backup.log 2>&1' >"$tmp"
    install -o root -g root -m 644 "$tmp" "$file"
    echo "Backup agendado diariamente às 06:00 UTC. Mantenha cópia criptografada fora da VPS."
    ;;
  -h|--help|help|"") usage ;;
  *) usage >&2; exit 2 ;;
esac
