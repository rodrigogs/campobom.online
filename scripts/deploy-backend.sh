#!/bin/bash

# Ensure that AWS_BRANCH and AWS_APP_ID environment variables are set
if [[ -z "$AWS_BRANCH" || -z "$AWS_APP_ID" ]]; then
  echo "Error: Both AWS_BRANCH and AWS_APP_ID environment variables are required."
  exit 1
fi

isFirstDeploy=false

log() {
  local message="$1"
  local type="${2:-info}"

  case $type in
    info)
      echo "$message"
      ;;
    warn)
      echo "Warning: $message"
      ;;
    error)
      echo "Error: $message" >&2
      ;;
  esac
}

move_file() {
  local source="$1"
  local destination="$2"

  log "Moving $source to $destination"
  if mv "$source" "$destination"; then
    log "Moved $source to $destination"
  else
    log "Failed to move $source to $destination" "error"
    exit 1
  fi
}

cleanup() {
  log "Initiating cleanup..."
  if $isFirstDeploy; then
    log "First deployment detected, restoring original backend file."
    move_file "amplify/backend.ts" "amplify/backend-init.ts"
    move_file "amplify/backend.ts.bak" "amplify/backend.ts"
  fi

  if rm -rf scripts/deploy-backend.mjs; then
    log "Removed scripts/deploy-backend.mjs"
  else
    log "Failed to remove scripts/deploy-backend.mjs" "error"
  fi
}

trap cleanup SIGINT SIGTERM EXIT

check_stack_existence() {
  output=$(npx ampx generate outputs --branch "$AWS_BRANCH" --app-id "$AWS_APP_ID" 2>&1)

  if [[ $? -eq 0 ]]; then
    log "Stack exists, proceeding with deployment."
  else
    echo "Debug: $output"

    if grep -q "StackDoesNotExistError: Stack does not exist." <<< "$output"; then
      log "Stack does not exist. This is the first deploy." "warn"
      isFirstDeploy=true
    else
      log "An error occurred while checking if the stack exists" "error"
      exit 1
    fi
  fi
}

deploy_backend() {
  if $isFirstDeploy; then
    move_file "amplify/backend.ts" "amplify/backend.ts.bak"
    move_file "amplify/backend-init.ts" "amplify/backend.ts"
  fi

  if npx ampx pipeline-deploy --branch "$AWS_BRANCH" --app-id "$AWS_APP_ID"; then
    log "Backend deployment successful."
    if $isFirstDeploy; then
      log "First deployment detected, redeploying backend after initial setup."
      cleanup
      if npx ampx pipeline-deploy --branch "$AWS_BRANCH" --app-id "$AWS_APP_ID"; then
        log "Backend redeployment after initial setup successful."
      else
        log "Redeployment failed" "error"
        exit 1
      fi
    fi
  else
    log "Deployment failed" "error"
    exit 1
  fi
}

main() {
  check_stack_existence
  deploy_backend
  cleanup
}

main
