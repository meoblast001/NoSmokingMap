#!/usr/bin/env bash
set -euo pipefail
HOST_UID="$(id -u)" HOST_GID="$(id -g)" docker compose "$@"
