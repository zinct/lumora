dfx identity new lumora
dfx identity use lumora

# Create token with initial parameters
dfx canister call token initializeToken "(
  record {
    tokenName = \"Lumora\";
    tokenSymbol = \"LUM\";
    initialSupply = 100_000_000_000 : nat; 
    tokenLogo = \"\";
  }
)"

BACKEND_CANISTER_ID=$(dfx canister id backend)

# Transfer token to lumora canister treasury (This is for testing purposes)
dfx canister call token icrc1_transfer "(
  record {
    to = record {
      owner = principal \"$BACKEND_CANISTER_ID\";
      subaccount = null;
    };
    amount = 99_999_990_000 : nat;
    fee = null;
    memo = null;
    created_at_time = null;
  }
)"

echo "Token initialized successfully" 