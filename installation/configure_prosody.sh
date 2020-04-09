#!/bin/bash

DOMAIN=$1
PROSODYPASSWORD=$2
INSTALLPATH=$3
APPID=$4
APPSECRET=$5

echo ""
echo "PROSODY $DOMAIN create configuration file"

PROSODYCONFIGPATH=/etc/prosody/conf.avail/$DOMAIN.cfg.lua

if [ -f $PROSODYCONFIGPATH ]
then
    sudo rm $PROSODYCONFIGPATH
    sudo rm /var/lib/prosody/$DOMAIN.*
    sudo rm /var/lib/prosody/auth.$DOMAIN.*
    sudo rm /etc/prosody/certs/$DOMAIN.*
    sudo rm /etc/prosody/certs/auth.$DOMAIN.*
    sudo rm /usr/local/share/ca-certificates/auth.$DOMAIN.crt
fi

sudo cp "$INSTALLPATH/$DOMAIN/doc/debian/jitsi-meet-prosody/prosody.cfg.lua-jvb.example" $PROSODYCONFIGPATH

sudo sed -i "s/plugin_paths = { \"\/usr\/share\/jitsi-meet\/prosody-plugins\/\" }/plugin_paths = { \"\/srv\/$DOMAIN\/resources\/prosody-plugins\/\" }/g" $PROSODYCONFIGPATH
sudo sed -i "s/__turnSecret__/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/focusSecret/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/jvbSecret/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/jitmeet.example.com/$DOMAIN/g" $PROSODYCONFIGPATH

sudo sed -i "s/appId/$APPID/g" $PROSODYCONFIGPATH
sudo sed -i "s/appSecret/$APPSECRET/g" $PROSODYCONFIGPATH

sudo ln -s $PROSODYCONFIGPATH /etc/prosody/conf.d/$DOMAIN.cfg.lua

echo "Prosody generate keys for domain $DOMAIN and restart"
sudo service prosody restart

sudo prosodyctl cert generate $DOMAIN
sudo prosodyctl cert generate "auth.$DOMAIN"

ln -sf /var/lib/prosody/$DOMAIN.* /etc/prosody/certs/
ln -sf /var/lib/prosody/auth.$DOMAIN.* /etc/prosody/certs/

ln -sf /var/lib/prosody/auth.$DOMAIN.crt /usr/local/share/ca-certificates/auth.$DOMAIN.crt
update-ca-certificates -f
sudo prosodyctl register focus auth.$DOMAIN $PROSODYPASSWORD
sudo prosodyctl register jvb auth.$DOMAIN $PROSODYPASSWORD

cd ~/
echo "===================> PROSODY configure jitsi-meet-tokens  <==================="
if [ ! -f luarocks-2.4.1.tar.gz ]
then
echo "
deb http://ftp.us.debian.org/debian/ stretch main contrib non-free
deb http://ftp.us.debian.org/debian/ stretch-updates main contrib non-free
deb http://security.debian.org/debian-security/ stretch/updates main contrib non-free
" >> /etc/apt/sources.list

    sudo apt-get update -y

    sudo apt-get install liblua5.2-dev
    wget https://keplerproject.github.io/luarocks/releases/luarocks-2.4.1.tar.gz
    tar -xzf luarocks-2.4.1.tar.gz
    cd ./luarocks-2.4.1
    ./configure --lua-version=5.2 --versioned-rocks-dir & wait
    make build & wait
    make install & wait
    luarocks-5.2 install net-url
    luarocks-5.2 install basexx
    sudo apt-get install -y libssl1.0-dev
    luarocks-5.2 install luajwtjitsi
    luarocks-5.2 install lua-cjson 2.1.0-1
fi
