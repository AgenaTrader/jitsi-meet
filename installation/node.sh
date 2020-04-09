#!/bin/bash
echo ""
echo "Start installation node"

if command -v node > /dev/null;
then
    echo "NODE already installed"
else
    sudo apt install -y software-properties-common
    curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
    sudo apt install -y nodejs
fi
