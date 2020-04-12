#!/bin/bash
echo "Compile jitsi sources"
INSTALLPATH=$1
DOMAIN=$2

cd $INSTALLPATH/$DOMAIN
sudo npm install & wait
sudo make & wait
