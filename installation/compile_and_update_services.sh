#!/bin/bash
echo "Compile jitsi sources"
INSTALLPATH=$1
DOMAIN=$2

cd $INSTALLPATH/$DOMAIN
sudo npm install & wait
sudo make & wait

echo "Restart services"
sudo service nginx restart
sudo service prosody restart
sudo service jicofo restart
sudo service jitsi-videobridge2 restart
