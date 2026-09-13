#!/usr/bin/env bash
# case-study deploy script
# Called by Jenkins pipeline after pushing a new image to GHCR.
# Replaces the running container atomically.
set -euo pipefail

IMAGE="${1:-ghcr.io/g3941813-svg/case-study:latest}"
CONTAINER="soomin-case-studies"
NETWORK="my-network"

echo "=== Deploying ${IMAGE} ==="

# Pull the new image
echo "Pulling ${IMAGE}..."
docker pull "${IMAGE}"

# Stop and remove the existing container if it exists
if docker inspect "${CONTAINER}" &>/dev/null; then
    echo "Stopping existing container..."
    docker stop "${CONTAINER}" 2>/dev/null || true
    docker rm "${CONTAINER}" 2>/dev/null || true
fi

# Start a new container
echo "Starting new container..."
docker run -d \
    --name "${CONTAINER}" \
    --restart unless-stopped \
    -p 127.0.0.1:3001:3000 \
    -e NODE_ENV=production \
    "${IMAGE}"

# Connect to the shared Docker network so nginx can reach it
echo "Connecting to ${NETWORK}..."
docker network connect "${NETWORK}" "${CONTAINER}" 2>/dev/null || true

# Wait for healthcheck
echo "Waiting for healthcheck..."
for i in $(seq 1 12); do
    sleep 5
    if docker inspect "${CONTAINER}" --format='{{.State.Health.Status}}' 2>/dev/null | grep -q healthy; then
        echo "Container is healthy!"
        exit 0
    fi
done

echo "ERROR: Container did not become healthy within 60s"
docker logs "${CONTAINER}" --tail 20 2>/dev/null || true
exit 1