#!/bin/bash

dfx identity new lumora --disable-encryption
dfx identity use lumora

BACKEND_CANISTER_ID=$(dfx canister id backend)

# Create token with initial supply
dfx canister call token initializeToken "(
  record {
    \"principal\" = principal \"$BACKEND_CANISTER_ID\";
    initialSupply = 100_000_000_000_000_000 : nat;
    tokenSymbol = \"LUM\";
    tokenLogo = \"\";
    tokenName = \"Lumora Token\";
  },
)"

echo "Token initialized successfully" 