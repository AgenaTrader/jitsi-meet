#!/bin/bash
echo "Install choopchat.tokenissuer.service"
INSTALLPATH=$1
DOMAIN=$2

if [ ! -d /var/www/ChoopChat.TokenIssuer ]
then
    wget -O- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
    sudo mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
    wget https://packages.microsoft.com/config/debian/10/prod.list
    sudo mv prod.list /etc/apt/sources.list.d/microsoft-prod.list

    apt-get update -y & wait
    apt-get install -y dotnet-sdk-3.1 aspnetcore-runtime-3.1 dotnet-runtime-3.1

    cd $INSTALLPATH/$DOMAIN/resources
    cp ./choopchat.tokenissuer.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable choopchat.tokenissuer.service
    systemctl start choopchat.tokenissuer.service

    sudo /bin/bash deploy_tokenissuer.sh & wait
fi
