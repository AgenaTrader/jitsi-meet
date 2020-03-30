#!/usr/bin/env bash

if [[ "$EUID" -ne 0 ]]; then
	echo -e "Sorry, you need to run this as root"
	exit
fi

cat << EOF
Usage: $0 options
This script install jitsi meet configured with the jitsi videobridge
OPTIONS:
   -d      Domain (Required)
   -p      Password 1 (Default: choopchat)
EOF

#constants / settings
INSTALLPATH="/srv"
PROSODYPASSWORD="choopchat"

while getopts “d:p:” OPTION
do
    case $OPTION in
        d)
            DOMAIN=$OPTARG
            ;;
        p)
            PROSODYPASSWORD=$OPTARG
            ;;
        ?)
            exit
            ;;
    esac
done

if [ -z $DOMAIN ]
then
    echo "Parameter -d DOMAIN - is required"
    exit
fi

echo "-------> Start installation required packages <-------"

apt install -y unzip git curl make default-jdk maven dpkg wget
# ufw

echo "-------> Start installation of JitsiMeet on $DOMAIN <-------"


if [ ! -d "$INSTALLPATH/$DOMAIN" ]
then
    cd $INSTALLPATH
    echo "Download and install jitsi from jitsi-meet"
    git clone https://github.com/AgenaTrader/jitsi-meet.git & wait
    cd ./jitsi-meet
    git checkout develop & wait
#   git remote add jitsi https://github.com/jitsi/jitsi-meet.git
#   git pull jitsi master
    cp -rf ./choop.chat-config.js "./$DOMAIN-config.js"

    sed -i "s/domain: 'choop.chat',/domain: '$DOMAIN',/gi" "./$DOMAIN-config.js"
    sed -i "s/bridge: 'jitsi-videobridge.choop.chat',/\/\/ bridge: 'jitsi-videobridge.$DOMAIN',/gi" "./$DOMAIN-config.js"
    sed -i "s/muc: 'conference.choop.chat'/muc: 'conference.$DOMAIN'/gi" "./$DOMAIN-config.js"

    cd $INSTALLPATH
    sudo mv jitsi-meet ./$DOMAIN
fi

echo "-------> Start installation prosody <-------"
sleep 2

if command -v prosodyctl > /dev/null;
then
        echo "Prosody already installed"
        prosodyctl status
else
    apt install -y prosody
fi

echo "Prosody add new VirtualHost and Component"
sudo cp "$INSTALLPATH/$DOMAIN/doc/example-config-files/prosody.cfg.lua.example" /etc/prosody/prosody.cfg.lua
echo "Include \"conf.d/*.cfg.lua\"" >> /etc/prosody/prosody.cfg.lua

if [ ! -f /etc/prosody/conf.avail/$DOMAIN.cfg.lua ]
then

    sudo cp "$INSTALLPATH/$DOMAIN/doc/debian/jitsi-meet-prosody/prosody.cfg.lua-jvb.example" /etc/prosody/conf.avail/$DOMAIN.cfg.lua

    sudo sed -i "s/plugin_paths = { \"\/usr\/share\/jitsi-meet\/prosody-plugins\/\" }/plugin_paths = { \"\/srv\/$DOMAIN\/resources\/prosody-plugins\/\" }/g" /etc/prosody/conf.avail/$DOMAIN.cfg.lua
    sudo sed -i "s/__turnSecret__/$PROSODYPASSWORD/g" /etc/prosody/conf.avail/$DOMAIN.cfg.lua
    sudo sed -i "s/focusSecret/$PROSODYPASSWORD/g" /etc/prosody/conf.avail/$DOMAIN.cfg.lua
    sudo sed -i "s/jitmeet.example.com/$DOMAIN/g" /etc/prosody/conf.avail/$DOMAIN.cfg.lua

    sudo ln -s /etc/prosody/conf.avail/$DOMAIN.cfg.lua /etc/prosody/conf.d/$DOMAIN.cfg.lua

    echo "-------> Prosody generate keys for domain $DOMAIN and restart <-------"
    sudo prosodyctl cert key $DOMAIN 2048
    sudo prosodyctl cert key "auth.$DOMAIN" 2048

    ln -sf /var/lib/prosody/$DOMAIN.crt /etc/prosody/certs/$DOMAIN.crt
    ln -sf /var/lib/prosody/auth.$DOMAIN.crt /usr/local/share/ca-certificates/auth.$DOMAIN.crt
    update-ca-certificates -f
    prosodyctl register focus auth.$DOMAIN $PROSODYPASSWORD

    service prosody restart
    prosodyctl start
fi

echo "-------> Start installation nginx <-------"

if command -v nginx > /dev/null;
then
    echo "NGINX already installed"
    nginx -v
else
    sudo apt install -y nginx
    sudo service nginx start

    sudo ufw app list
#    sudo ufw allow 'Nginx HTTP'
#    sudo ufw allow 'Nginx HTTPS'
    sudo ufw status
fi

sed -i "s/# tcp_nopush on;/tcp_nopush on;/gi" /etc/nginx/nginx.conf
sed -i "s/# types_hash_max_size 2048;/types_hash_max_size 2048;/gi" /etc/nginx/nginx.conf
sed -i "s/# server_names_hash_bucket_size 64;/server_names_hash_bucket_size 128;/gi" /etc/nginx/nginx.conf

echo "-------> Start installation node <-------"

if command -v node > /dev/null;
then
    echo "NODE already installed"
    node -v
else
    sudo apt install -y software-properties-common
    curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
    sudo apt install -y nodejs
fi

echo "-------> Start installation npm <-------"

if command -v npm > /dev/null;
then
    echo "NPM already installed"
    npm -v
else
    curl -L https://npmjs.org/install.sh | sudo sh &
fi

if [ ! -f /etc/nginx/sites-available/$DOMAIN.conf ]
then
    cp -rf "$INSTALLPATH/$DOMAIN/doc/debian/jitsi-meet/jitsi-meet.example" /etc/nginx/sites-available/$DOMAIN.conf

    sed -i "s/ssl_certificate \/etc\/jitsi\/meet\/jitsi-meet.example.com.crt;/ssl_certificate \/etc\/prosody\/certs\/$DOMAIN.crt;/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/ssl_certificate_key \/etc\/jitsi\/meet\/jitsi-meet.example.com.key;/ssl_certificate_key \/etc\/prosody\/certs\/$DOMAIN.key;/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/server_names_hash_bucket_size 64;/#server_names_hash_bucket_size 64;/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/jitsi-meet.example.com/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/\/usr\/share\/jitsi-meet/\/srv\/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/\/etc\/jitsi\/meet/\/srv\/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/libs\/external_api.min.js;/modules\/API\/external\/external_api.js;/g" /etc/nginx/sites-available/$DOMAIN.conf

    sudo ln -s /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/$DOMAIN.conf
fi

echo "-------> Write domain to host file <-------"

if [ -n "$(grep $DOMAIN /etc/hosts)" ]
then
    echo "$DOMAIN already exists"
else
    echo "Adding domain $DOMAIN to your /ets/hosts";
    echo "127.0.0.1\t$DOMAIN" | sudo tee -a /etc/hosts

    if [ -n "$(grep $DOMAIN /etc/hosts)" ]
    then
        echo "$DOMAIN was added succesfully";
    else
        echo "Failed to add $DOMAIN, try again!";
        exit
    fi
fi

echo "-------> Install VideoBridge <-------"

cd ~

if [ ! -f ~/jitsi-videobridge_1126-1_amd64.deb ]
then
  wget https://download.jitsi.org/stable/jitsi-videobridge_1126-1_amd64.deb
  sudo dpkg -i jitsi-videobridge_1126-1_amd64.deb

  echo "-------> VIDEOBRIDGE change config file <-------"
  sed -i "/JVB_HOSTNAME=/c\JVB_HOSTNAME=$DOMAIN" /etc/jitsi/videobridge/config
  sed -i "/JVB_HOST=/c\JVB_HOST=" /etc/jitsi/videobridge/config
  sed -i "/JVB_SECRET=/c\JVB_SECRET=$PROSODYPASSWORD" /etc/jitsi/videobridge/config
  sed -i "/JVB_OPTS=/c\JVB_OPTS=\"--apis=,\"" /etc/jitsi/videobridge/config

  echo "-------> VIDEOBRIDGE change sip-communicator.properties  <-------"
  echo "
org.ice4j.ice.harvest.DISABLE_AWS_HARVESTER=true
org.ice4j.ice.harvest.STUN_MAPPING_HARVESTER_ADDRESSES=meet-jit-si-turnrelay.jitsi.net:443
org.jitsi.videobridge.ENABLE_STATISTICS=true
org.jitsi.videobridge.STATISTICS_TRANSPORT=muc
org.jitsi.videobridge.xmpp.user.shard.HOSTNAME=localhost
org.jitsi.videobridge.xmpp.user.shard.DOMAIN=auth.$DOMAIN
org.jitsi.videobridge.xmpp.user.shard.USERNAME=jvb
org.jitsi.videobridge.xmpp.user.shard.PASSWORD=$PROSODYPASSWORD
org.jitsi.videobridge.xmpp.user.shard.MUC_JIDS=JvbBrewery@internal.auth.$DOMAIN
org.jitsi.videobridge.xmpp.user.shard.MUC_NICKNAME=ed04f680-0789-4476-aa44-c4fe580b4b54
  " >> /etc/jitsi/videobridge/sip-communicator.properties
fi

echo "-------> Install jicofo <-------"

cd ~

if [ ! -f ~/jicofo_1.0-508-1_amd64.deb ]
then
  wget https://download.jitsi.org/stable/jicofo_1.0-508-1_amd64.deb
  sudo dpkg -i jicofo_1.0-508-1_amd64.deb

  echo "-------> JICOFO change config file <-------"
  sed -i "/JICOFO_HOSTNAME=/c\JICOFO_HOSTNAME=$DOMAIN" /etc/jitsi/jicofo/config
  sed -i "/JICOFO_AUTH_DOMAIN=/c\JICOFO_AUTH_DOMAIN=auth.$DOMAIN" /etc/jitsi/jicofo/config
  sed -i "/JICOFO_SECRET=/c\JICOFO_SECRET=$PROSODYPASSWORD" /etc/jitsi/jicofo/config
  sed -i "/JICOFO_AUTH_PASSWORD=/c\JICOFO_AUTH_PASSWORD=$PROSODYPASSWORD" /etc/jitsi/jicofo/config

  echo "-------> JICOFO change sip-communicator.properties  <-------"
  echo "org.jitsi.jicofo.BRIDGE_MUC=JvbBrewery@internal.auth.$DOMAIN" >> /etc/jitsi/jicofo/sip-communicator.properties
fi

echo "-------> Update current jitsi from git <-------"

cd $INSTALLPATH/$DOMAIN
git pull origin master & wait
sudo npm install & wait
sudo make & wait

#sudo apt-get install certbot python-certbot-nginx
#sudo certbot certonly --nginx --dry-run -d $DOMAIN

sudo service nginx restart
sudo service prosody restart
sudo service jicofo restart
sudo service jitsi-videobridge restart

echo "-------> Installation finished <-------"
