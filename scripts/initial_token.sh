# Create token with initial parameters
dfx canister call backend initializeLumora "(
  record {
    tokenName = \"Lumora\";
    tokenSymbol = \"LUM\";
    initialSupply = 100_000_000_000 : nat; 
    tokenLogo = \"\";
  }
)"

dfx identity use default
echo "Token created successfully" 