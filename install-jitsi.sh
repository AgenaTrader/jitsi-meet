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
VIDEOBRIDGEVERSION="jitsi-videobridge-linux-x64-1132"
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

apt install -y unzip git curl make default-jdk maven dpkg
# ufw

sleep 2

echo "-------> Start installation of JitsiMeet on $DOMAIN <-------"
sleep 2

if [ ! -d "$INSTALLPATH/$DOMAIN" ]
then
    cd $INSTALLPATH
    echo "Download and install jitsi from jitsi-meet"
    git clone https://github.com/AgenaTrader/jitsi-meet.git & wait
    cd ./jitsi-meet
    git checkout develop & wait
#   git remote add jitsi https://github.com/jitsi/jitsi-meet.git
#   git pull jitsi master
    cp -rf ./choop.chat-config.js ./config.js

    sed -i "s/domain: 'choop.chat',/domain: '$DOMAIN',/gi" "./config.js"
    sed -i "s/bridge: 'jitsi-videobridge.choop.chat',/bridge: 'jitsi-videobridge.$DOMAIN',/gi" "./config.js"
    sed -i "s/muc: 'conference.choop.chat'/muc: 'conference.$DOMAIN'/gi" "./config.js"

    cd $INSTALLPATH
    sudo mv jitsi-meet ./$DOMAIN
fi

echo "-------> Start installation prosody <-------"
sleep 1

if command -v prosodyctl > /dev/null;
then
        echo "Prosody already installed"
        prosodyctl status
else
    apt install -y prosody
fi

if [ ! -f /var/lib/prosody/$DOMAIN.crt ]
then
    cp -rf "$INSTALLPATH/$DOMAIN/doc/example-config-files/prosody.cfg.lua.example" /etc/prosody/prosody.cfg.lua
    echo "Include \"conf.d/*.cfg.lua\"" >> /etc/prosody/prosody.cfg.lua

    echo "Prosody add new VirtualHost and Component"
echo "
VirtualHost \"$DOMAIN\"
    authentication = \"anonymous\"
    ssl = {
        key = \"/etc/prosody/certs/$DOMAIN.key\";
        certificate = \"/etc/prosody/certs/$DOMAIN.crt\";
    }
    modules_enabled = {
        \"bosh\";
        \"pubsub\";
    }
    c2s_require_encryption = false

Component \"conference.$DOMAIN\" \"muc\"
    storage = \"null\"
admins = { \"focus@auth.$DOMAIN\" }

Component \"jitsi-videobridge.$DOMAIN\"
    component_secret = \"$PROSODYPASSWORD\"

VirtualHost \"auth.$DOMAIN\"
    ssl = {
        key = \"/etc/prosody/certs/auth.$DOMAIN.key\";
        certificate = \"/etc/prosody/certs/auth.$DOMAIN.crt\";
    }
    authentication = \"internal_plain\"

Component \"focus.$DOMAIN\"
    component_secret = \"$PROSODYPASSWORD\"" | sudo tee -a "/etc/prosody/conf.avail/$DOMAIN.cfg.lua"

    ln -s /etc/prosody/conf.avail/$DOMAIN.cfg.lua /etc/prosody/conf.d/$DOMAIN.cfg.lua

    echo "Prosody generate keys for domain $DOMAIN and restart"
#    sudo prosodyctl cert key $DOMAIN 2048
#    sudo prosodyctl cert key "auth.$DOMAIN" 2048

    sudo prosodyctl cert generate $DOMAIN
    sudo prosodyctl cert generate "auth.$DOMAIN"

    ln -sf /var/lib/prosody/auth.$DOMAIN.crt /usr/local/share/ca-certificates/auth.$DOMAIN.crt
    update-ca-certificates -f
    prosodyctl register focus auth.$DOMAIN $PROSODYPASSWORD
    prosodyctl restart
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
    cp -rf "$INSTALLPATH/$DOMAIN/doc/example-config-files/jitsi.example.com.example" /etc/nginx/sites-available/$DOMAIN.conf

    sed -i "s/server_name jitsi.example.com;/server_name $DOMAIN;/gi" /etc/nginx/sites-available/$DOMAIN.conf
    sed -i "s/root \/srv\/jitsi.example.com;/root \/srv\/$DOMAIN;/g" /etc/nginx/sites-available/$DOMAIN.conf

    sudo ln -s /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/$DOMAIN.conf
fi

echo "-------> Write domain to host file <-------"
sleep 1

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
sleep 2
cd ~

if [ ! -f ~/jitsi-videobridge-linux-x64-1132.zip ]
then
  wget https://download.jitsi.org/jitsi-videobridge/linux/jitsi-videobridge-linux-x64-1132.zip
  unzip jitsi-videobridge-linux-x64-1132.zip

  mkdir -p ~/.sip-communicator
cat > ~/.sip-communicator/sip-communicator.properties << EOF
org.jitsi.impl.neomedia.transform.srtp.SRTPCryptoContext.checkReplay=false
# The videobridge uses 443 by default with 4443 as a fallback, but since we're already
# running nginx on 443 in this example doc, we specify 4443 manually to avoid a race condition
org.jitsi.videobridge.TCP_HARVESTER_PORT=4443
EOF

  sudo ./jitsi-videobridge-linux-x64-1132/jvb.sh --host=localhost --domain=$DOMAIN --port=5347 --secret=$PROSODYPASSWORD &

  echo "/bin/bash ~/jitsi-videobridge-linux-x64-1132/jvb.sh --host=localhost --domain=$DOMAIN --port=5347 --secret=$PROSODYPASSWORD </dev/null >> /var/log/jvb.log 2>&1" | sudo tee -a "/etc/rc.local"
fi


echo "-------> Install jicofo <-------"
sleep 2
cd ~

if [ ! -d ~/jicofo ]
then
  git clone https://github.com/jitsi/jicofo.git & wait
  cd jicofo
  mvn package -DskipTests -Dassembly.skipAssembly=false
  unzip target/jicofo-1.1-SNAPSHOT-archive.zip
  cd ./jicofo-1.1-SNAPSHOT-archive

  sudo ./jicofo.sh --host=localhost --domain=$DOMAIN --secret=$PROSODYPASSWORD --user_domain=auth.$DOMAIN --user_name=focus --user_password=$PROSODYPASSWORD


fi

echo "-------> Update current jitsi from git <-------"
cd $INSTALLPATH/$DOMAIN
sleep 1
git pull origin master &
wait
sudo npm install &
wait
sudo make &
wait

sudo service nginx restart

echo "-------> Installation finished <-------"
