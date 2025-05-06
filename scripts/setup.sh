#!/bin/bash

chmod +x scripts/initial-token.sh
chmod +x scripts/initial-nft.sh
chmod +x scripts/grant-permission.sh
chmod +x scripts/upload-models-to-canister.sh
# chmod +x scripts/generate-dummy-projects.sh

./scripts/initial-token.sh
./scripts/initial-nft.sh
./scripts/grant-permission.sh
./scripts/upload-models-to-canister.sh
# ./scripts/generate-dummy-projects.sh