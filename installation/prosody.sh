#!/bin/bash
echo ""
echo "Start installation prosody"

if [ -f /etc/prosody/conf.avail/$DOMAIN.cfg.lua ]
then
    echo "Prosody already installed"
else
    sudo apt install -y jitsi-meet-prosody
    sudo mkdir /etc/prosody
    cd /etc/prosody
    sudo mkdir certs conf.avail conf.d

    sed -i "/plugin_paths/c\-- plugin_paths = { \"\/usr\/local\/lib\/prosody\/modules\" }" /etc/prosody/prosody.cfg.lua

    sudo service prosody start
fi
