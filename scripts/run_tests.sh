#!/usr/bin/env bash
# run_tests.sh — run backend (pytest) and frontend (vitest) test suites
# Usage:
#   ./scripts/run_tests.sh [backend|frontend|all] [--watch] [--save-report report.json]
# Examples:
#   ./scripts/run_tests.sh backend            # run backend pytest
#   ./scripts/run_tests.sh frontend --watch  # run vitest in watch mode
#   ./scripts/run_tests.sh all --save-report report.json

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MODE="all"
WATCH=false
SAVE_REPORT=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    backend|frontend|all)
      MODE="$1"
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --save-report)
      SAVE_REPORT="$2"
      shift 2
      ;;
    -h|--help)
      sed -n '1,120p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      sed -n '1,120p' "$0"
      exit 2
      ;;
  esac
done

# Helper: run pytest
run_pytest() {
  echo "Running backend tests (pytest)..."
  PYTEST_CMD=(python -m pytest -q -vv -s)
  if [[ -n "$SAVE_REPORT" ]]; then
    # Save output and still show live output using tee
    "${PYTEST_CMD[@]}" | tee "$SAVE_REPORT"
  else
    "${PYTEST_CMD[@]}"
  fi
}

# Helper: run vitest
run_vitest() {
  echo "Running frontend tests (vitest)..."
  if [[ "$WATCH" == true ]]; then
    npx vitest --watch
  else
    npx vitest run
  fi
}

case "$MODE" in
  backend)
    run_pytest
    ;;
  frontend)
    run_vitest
    ;;
  all)
    run_pytest
    run_vitest
    ;;
  *)
    echo "Unknown mode: $MODE"
    exit 2
    ;;
esac

echo "Done."
