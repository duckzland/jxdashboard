#!/bin/bash

export JX_DEV="production"


echo "[+] Repacking Javascript"
echo ""
webpack

echo ""
echo "[+] Cleaning old binaries"
echo ""
rm -rf ./tmp
echo ""
echo "[+] Building binary"
echo ""
electron-packager . jxdashboard --platform linux --arch x64 --out ./tmp --overwrite
echo ""
echo "[+] Packing binary as deb"
electron-installer-debian --src ./tmp/jxdashboard-linux-x64 --dest build/installers/ --arch amd64
echo ""
echo "[+] Cleaning out temporary folder"
rm -rf ./tmp
echo ""


