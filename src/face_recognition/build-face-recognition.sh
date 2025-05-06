#!/bin/bash
set -ex

# Detect OS and set appropriate wasm target
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    WASM_TARGET="wasm32-wasip1"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    WASM_TARGET="wasm32-wasi"
else
    # Linux and others
    WASM_TARGET="wasm32-wasip1"
fi

export RUSTFLAGS=$RUSTFLAGS' -C target-feature=+simd128'
cargo build --release --target=$WASM_TARGET
wasi2ic ./target/$WASM_TARGET/release/face_recognition.wasm ./target/$WASM_TARGET/release/face_recognition-ic.wasm
npx wasm-opt -Os --enable-simd --enable-bulk-memory -o ./target/$WASM_TARGET/release/face_recognition-ic.wasm \
    ./target/$WASM_TARGET/release/face_recognition-ic.wasm
