#!/bin/bash

BACKEND_CANISTER_ID=$(dfx canister id backend)

if [ -z "$BACKEND_CANISTER_ID" ]; then
    echo "Error: Could not get backend canister ID"
    exit 1
fi

echo "Backend canister ID: $BACKEND_CANISTER_ID"

echo "dfx canister call storage authorize '(principal \"$BACKEND_CANISTER_ID\")'"
dfx canister call storage authorize "(principal \"$BACKEND_CANISTER_ID\")"


if [ $? -eq 0 ]; then
    echo "Permission granted successfully!"
else
    echo "Error: Failed to grant permission"
    exit 1
fi