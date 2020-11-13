#!/bin/bash
echo ""
echo "Start installation prosody"


PROSODY_VERSION='1.0.4428-1'

DOMAIN=$1

if [ -f /etc/prosody/conf.avail/$DOMAIN.cfg.lua ]
then
    echo "Prosody already installed"
else
    sudo mkdir /etc/prosody
    sudo apt install -y jitsi-meet-prosody=$PROSODY_VERSION
    cd /etc/prosody || exit
    sudo mkdir certs conf.avail conf.d

    sed -i "/plugin_paths/c\-- plugin_paths = { \"\/usr\/local\/lib\/prosody\/modules\" }" /etc/prosody/prosody.cfg.lua

    sudo service prosody start
fi
