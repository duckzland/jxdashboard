#!/bin/bash

export JX_DEV="production"


echo "[+] Repacking Javascript"
echo ""
webpack

echo ""
echo "[+] Cleaning old binaries"
echo ""
rm -rf ./build/bin
echo ""
echo "[+] Building binary"
echo ""
electron-packager . jxdashboard --platform linux --arch x64 --out ./build/bin --overwrite


