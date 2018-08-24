#!/bin/bash

export JX_DEV="production"


echo "[+] Repacking Javascript"
echo ""
webpack -p
echo ""
echo "[+] Cleaning old binaries"
echo ""
rm -rf ./build/bin
echo ""
echo "[+] Building binary"
echo ""
electron-packager . jxdashboard --platform linux --arch x64 --out ./build/bin --overwrite="true" --ignore="(/app$|/docs$|/build$|/scripts$|\\.gitignore$|\\.idea$|npm-debug\\.log$|\\.git$|package-lock\\.json$|webpack\\.config\\.js$)" 


