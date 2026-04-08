#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEMPLATE_ROOT="${REPO_ROOT}/testing/templates"

usage() {
  cat <<'EOF'
Usage:
  bash ./scripts/stamp-tests.sh <target-dir> [--force] [--dry-run] [--app-name NAME] [--port PORT] [--base-url URL]

Examples:
  bash ./scripts/stamp-tests.sh ../clone-7-new-tool
  bash ./scripts/stamp-tests.sh ./testing/fixtures/clone-smoke-output --force
  bash ./scripts/stamp-tests.sh ../clone-7-new-tool --dry-run --port 4931
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

TARGET_DIR=""
APP_NAME=""
LOCAL_PORT=""
BASE_URL=""
FORCE_OVERWRITE="false"
DRY_RUN="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE_OVERWRITE="true"
      shift
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --app-name)
      APP_NAME="${2:-}"
      shift 2
      ;;
    --port)
      LOCAL_PORT="${2:-}"
      shift 2
      ;;
    --base-url)
      BASE_URL="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "${TARGET_DIR}" ]]; then
        TARGET_DIR="$1"
        shift
      else
        echo "Unexpected argument: $1" >&2
        usage
        exit 1
      fi
      ;;
  esac
done

if [[ -z "${TARGET_DIR}" ]]; then
  echo "Target directory is required." >&2
  usage
  exit 1
fi

TARGET_DIR="${TARGET_DIR%/}"
TARGET_PACKAGE_JSON="${TARGET_DIR}/package.json"

if [[ ! -d "${TEMPLATE_ROOT}" ]]; then
  echo "Missing template directory: ${TEMPLATE_ROOT}" >&2
  exit 1
fi

if [[ ! -f "${TARGET_PACKAGE_JSON}" ]]; then
  echo "Target must already contain a package.json: ${TARGET_PACKAGE_JSON}" >&2
  exit 1
fi

extract_package_field() {
  local field_name="$1"
  node -e '
    const fs = require("fs");
    const fieldName = process.argv[1];
    const filePath = process.argv[2];
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const value = packageJson[fieldName];
    if (value) {
      process.stdout.write(String(value));
    }
  ' "${field_name}" "${TARGET_PACKAGE_JSON}"
}

detect_port_from_package() {
  node -e '
    const fs = require("fs");
    const filePath = process.argv[1];
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const devScript = packageJson.scripts && packageJson.scripts.dev ? packageJson.scripts.dev : "";
    const match = devScript.match(/(?:--port|-p)\s+(\d{2,5})/);
    if (match) {
      process.stdout.write(match[1]);
    }
  ' "${TARGET_PACKAGE_JSON}"
}

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(extract_package_field "name")"
fi

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(basename "${TARGET_DIR}")"
fi

if [[ -z "${LOCAL_PORT}" ]]; then
  LOCAL_PORT="$(detect_port_from_package)"
fi

if [[ -z "${LOCAL_PORT}" ]]; then
  LOCAL_PORT="3000"
fi

if [[ -z "${BASE_URL}" ]]; then
  BASE_URL="http://127.0.0.1:${LOCAL_PORT}"
fi

STAMP_TARGETS=(
  "playwright.config.ts"
  "e2e/smoke.spec.ts"
  "TESTING.md"
  "package.test-scripts.json"
  ".env.e2e.example"
)

render_template() {
  local source_file="$1"
  APP_NAME="${APP_NAME}" LOCAL_PORT="${LOCAL_PORT}" BASE_URL="${BASE_URL}" node -e '
    const fs = require("fs");
    const sourceFile = process.argv[1];
    const replacements = {
      "__APP_NAME__": process.env.APP_NAME,
      "__LOCAL_PORT__": process.env.LOCAL_PORT,
      "__BASE_URL__": process.env.BASE_URL,
    };
    let output = fs.readFileSync(sourceFile, "utf8");
    for (const [needle, replacement] of Object.entries(replacements)) {
      output = output.split(needle).join(replacement);
    }
    process.stdout.write(output);
  ' "${source_file}"
}

echo "Stamping reusable test chassis"
echo "  target: ${TARGET_DIR}"
echo "  app:    ${APP_NAME}"
echo "  port:   ${LOCAL_PORT}"
echo "  url:    ${BASE_URL}"
echo

for relative_path in "${STAMP_TARGETS[@]}"; do
  source_path="${TEMPLATE_ROOT}/${relative_path}"
  target_path="${TARGET_DIR}/${relative_path}"

  if [[ ! -f "${source_path}" ]]; then
    echo "Missing template file: ${source_path}" >&2
    exit 1
  fi

  if [[ -e "${target_path}" && "${FORCE_OVERWRITE}" != "true" ]]; then
    echo "Refusing to overwrite existing file without --force: ${target_path}" >&2
    exit 1
  fi

  echo "  -> ${target_path}"

  if [[ "${DRY_RUN}" == "true" ]]; then
    continue
  fi

  mkdir -p "$(dirname "${target_path}")"
  render_template "${source_path}" > "${target_path}"
done

if [[ "${DRY_RUN}" == "true" ]]; then
  echo
  echo "Dry run complete. Re-run without --dry-run to write files."
else
  echo
  echo "Stamp complete. Next steps are documented in ${TARGET_DIR}/TESTING.md"
fi
