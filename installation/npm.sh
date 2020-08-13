#!/bin/bash
echo ""
echo "Start installation npm"

if command -v npm > /dev/null;
then
    echo "NPM already installed"
else
    curl -L https://npmjs.org/install.sh | sudo sh &
fi
