#!/usr/bin/env bash
# InfoHelp Omni 2.0 — verificação de pré-requisitos da VPS.
# Somente leitura: não instala pacotes, não altera portas nem grava segredos.
set -Eeuo pipefail

failures=0
warnings=0

ok() { printf 'OK      %s\n' "$*"; }
warn() { printf 'AVISO   %s\n' "$*"; warnings=$((warnings + 1)); }
fail() { printf 'ERRO    %s\n' "$*" >&2; failures=$((failures + 1)); }

printf 'InfoHelp Omni 2.0 — diagnóstico pré-instalação\n\n'

if [[ -r /etc/os-release ]]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  if [[ "${ID:-}" == "ubuntu" ]]; then
    ok "Sistema: Ubuntu ${VERSION_ID:-desconhecido}"
  else
    fail "Sistema ${PRETTY_NAME:-desconhecido}; instalador preparado para Ubuntu Server."
  fi
else
  fail "Não foi possível identificar a distribuição."
fi

if [[ -r /proc/meminfo ]]; then
  ram_kb=$(awk '/^MemTotal:/ {print $2}' /proc/meminfo)
  if [[ "${ram_kb:-0}" -ge 8000000 ]]; then
    ok "RAM: $((ram_kb / 1024)) MiB (margem recomendada)."
  elif [[ "${ram_kb:-0}" -ge 3500000 ]]; then
    warn "RAM: $((ram_kb / 1024)) MiB; o kit recomenda 8 GiB."
  else
    fail "RAM abaixo do mínimo aproximado de 4 GB exigido pelo kit single-server."
  fi
else
  warn "Não foi possível verificar a memória."
fi

cpu_count=$(getconf _NPROCESSORS_ONLN 2>/dev/null || printf '0')
if [[ "$cpu_count" =~ ^[0-9]+$ ]] && (( cpu_count >= 4 )); then
  ok "CPUs lógicas: $cpu_count."
else
  warn "Apenas ${cpu_count:-0} CPUs lógicas disponíveis; avaliar carga."
fi

if command -v df >/dev/null 2>&1; then
  free_kb=$(df -Pk / | awk 'NR==2 {print $4}')
  if [[ "${free_kb:-0}" -ge 40000000 ]]; then
    ok "Espaço livre no volume raiz: $((free_kb / 1024 / 1024)) GiB."
  else
    warn "Menos de aproximadamente 40 GB livres no volume raiz; confirmar espaço para imagens, mídia e banco."
  fi
fi

arch=$(uname -m)
case "$arch" in
  x86_64|aarch64) ok "Arquitetura: $arch." ;;
  *) fail "Arquitetura não prevista: $arch." ;;
esac

for program in docker curl openssl git; do
  if command -v "$program" >/dev/null 2>&1; then
    ok "$program encontrado."
  else
    warn "$program ainda não instalado (o instalador poderá preparar dependências)."
  fi
done

if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    ok "Docker Compose v2 encontrado."
  else
    warn "Docker Compose v2 ainda não disponível."
  fi
fi

if command -v ss >/dev/null 2>&1; then
  for port in 80 443; do
    if ss -H -ltn "( sport = :$port )" 2>/dev/null | grep -q .; then
      warn "Porta TCP $port em uso; será necessário identificar o proxy existente antes da instalação."
    else
      ok "Porta TCP $port livre."
    fi
  done
fi

printf '\nResultado: %d erro(s), %d aviso(s).\n' "$failures" "$warnings"
if (( failures > 0 )); then
  exit 1
fi
exit 0
