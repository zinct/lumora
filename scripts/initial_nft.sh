dfx identity new lumora
dfx identity use lumora

# Create token with initial parameters
dfx canister call nft initialize "(
  record {
    nftName = \"Lumora Impact NFTs\";
    nftSymbol = \"LINFT\";
  }
)"

# Mint Lumora Impact Pioneer NFT
dfx canister call nft mint "(
  record {
    name = \"Lumora Impact Pioneer\";
    description = \"Awarded to early contributors of environmental impact\";
    image = \"https://firebasestorage.googleapis.com/v0/b/terrax-de163.appspot.com/o/lumora%2F1.png?alt=media&token=0f5874fb-3cbe-4722-ad6b-7a7a85c303f0\";
    attributes = vec {
      record { trait_type = \"Rarity\"; value = \"Legendary\" };
      record { trait_type = \"Category\"; value = \"Impact\" };
    }
  },
  200_000_000_000 : nat,
  null
)"

# Mint Eco Warrior NFT
dfx canister call nft mint "(
  record {
    name = \"Eco Warrior\";
    description = \"For those who actively participate in environmental projects\";
    image = \"https://firebasestorage.googleapis.com/v0/b/terrax-de163.appspot.com/o/lumora%2F7%20(1).png?alt=media&token=8cc24af3-1177-444c-bfba-58e3ef1da69f\";
    attributes = vec {
      record { trait_type = \"Rarity\"; value = \"Rare\" };
      record { trait_type = \"Category\"; value = \"Participation\" };
    }
  },
  50_000_000_000 : nat,
  null
)"

# Mint Green Innovator NFT
dfx canister call nft mint "(
  record {
    name = \"Green Innovator\";
    description = \"Recognizing innovative solutions for sustainability\";
    image = \"https://firebasestorage.googleapis.com/v0/b/terrax-de163.appspot.com/o/lumora%2F3.png?alt=media&token=9806f0b5-5570-4b35-9582-d2caa0a8d6b2\";
    attributes = vec {
      record { trait_type = \"Rarity\"; value = \"Epic\" };
      record { trait_type = \"Category\"; value = \"Innovation\" };
    }
  },
  75_000_000_000 : nat,
  null
)"

# Mint Community Champion NFT
dfx canister call nft mint "(
  record {
    name = \"Community Champion\";
    description = \"For outstanding community leadership in environmental initiatives\";
    image = \"https://firebasestorage.googleapis.com/v0/b/terrax-de163.appspot.com/o/lumora%2F8%20(1).png?alt=media&token=23506ffc-9193-4bf5-8e65-47c242c74af8\";
    attributes = vec {
      record { trait_type = \"Rarity\"; value = \"Rare\" };
      record { trait_type = \"Category\"; value = \"Leadership\" };
    }
  },
  60_000_000_000 : nat,
  null
)"

# Mint Sustainability Guardian NFT
dfx canister call nft mint "(
  record {
    name = \"Sustainability Guardian\";
    description = \"Dedicated to protecting and preserving our environment\";
    image = \"https://firebasestorage.googleapis.com/v0/b/terrax-de163.appspot.com/o/lumora%2F4.png?alt=media&token=bdcf4556-aa62-4579-8517-8f07ff2d02c3\";
    attributes = vec {
      record { trait_type = \"Rarity\"; value = \"Epic\" };
      record { trait_type = \"Category\"; value = \"Protection\" };
    }
  },
  80_000_000_000 : nat,
  null
)"

echo "NFT initialized successfully" 