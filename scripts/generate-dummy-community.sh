#!/bin/bash

# Register a new community
echo "Registering dummy community..."
dfx canister call backend register '(record { name = "Lumora Official Hub"; registerAs = "community" })'

echo "Community registration completed!"
