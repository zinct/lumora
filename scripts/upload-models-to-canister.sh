#!/bin/bash

dfx canister call face_recognition clear_face_detection_model_bytes
dfx canister call face_recognition clear_face_recognition_model_bytes
ic-file-uploader face_recognition append_face_detection_model_bytes version-RFB-320.onnx
ic-file-uploader face_recognition append_face_recognition_model_bytes face-recognition.onnx
dfx canister call face_recognition setup_models