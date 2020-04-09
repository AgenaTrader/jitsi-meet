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
   -v      Vithout videobridge
   -p      Password 1 (Default: choopchat)
EOF

#constants / settings
INSTALLPATH="/srv"
PROSODYPASSWORD="choopchat"
APPID=701489589
APPSECRET="n-6P#f7Bw_ZmU26K"

WITHOUTVIDEOBRIDGE=false

while getopts “vd:p:” OPTION
do
    case $OPTION in
        d)
            DOMAIN=$OPTARG
            ;;
        v)
            WITHOUTVIDEOBRIDGE=true
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

NGINXCONFIGPATH=/etc/nginx/sites-available/$DOMAIN.conf
PROSODYCONFIGPATH=/etc/prosody/conf.avail/$DOMAIN.cfg.lua

echo "===================> Start installation required packages <==================="
apt-get update -y
apt install -y unzip git curl make default-jdk maven gnupg2 apt-transport-https lsof vim jq
apt-get update -y

echo 'deb https://download.jitsi.org stable/' >> /etc/apt/sources.list.d/jitsi-stable.list
wget -qO -  https://download.jitsi.org/jitsi-key.gpg.key | apt-key add -
apt-get update -y

echo "===================> Start installation JitsiMeet <==================="

if [ ! -d "$INSTALLPATH/$DOMAIN" ]
then
    sudo mkdir $INSTALLPATH
    cd $INSTALLPATH
    echo "Download and install jitsi from jitsi-meet"
    git clone https://github.com/AgenaTrader/jitsi-meet.git & wait
    cd ./jitsi-meet
    git checkout develop & wait

    sudo mv $INSTALLPATH/jitsi-meet $INSTALLPATH/$DOMAIN
fi

cd $INSTALLPATH/$DOMAIN
cp -rf ./choop.chat-config.js "./$DOMAIN-config.js"
sed -i "s/domain: 'choop.chat',/domain: '$DOMAIN',/gi" "./$DOMAIN-config.js"
sed -i "s/bridge: 'jitsi-videobridge.choop.chat',/\/\/ bridge: 'jitsi-videobridge.$DOMAIN',/gi" "./$DOMAIN-config.js"
sed -i "s/muc: 'conference.choop.chat'/muc: 'conference.$DOMAIN'/gi" "./$DOMAIN-config.js"

echo "===================> Write domain to host file <==================="

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

echo "===================> Start installation nginx <==================="

if command -v nginx > /dev/null;
then
    echo "NGINX already installed"
    nginx -v
else
    sudo apt install -y nginx
    sudo service nginx start

    sudo ufw app list
    sudo ufw status
fi

echo "===================> Start installation node <==================="

if command -v node > /dev/null;
then
    echo "NODE already installed"
    node -v
else
    sudo apt install -y software-properties-common
    curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
    sudo apt install -y nodejs
fi

echo "===================> Start installation npm <==================="

if command -v npm > /dev/null;
then
    echo "NPM already installed"
    npm -v
else
    curl -L https://npmjs.org/install.sh | sudo sh &
fi

echo "===================> Start installation prosody <==================="

if [ -f $PROSODYCONFIGPATH ]
then
        echo "Prosody already installed"
else
    sudo apt install -y jitsi-meet-prosody
    sudo mkdir /etc/prosody
    cd /etc/prosody
    mkdir certs conf.avail conf.d

    sed -i "/plugin_paths/c\-- plugin_paths = { \"\/usr\/local\/lib\/prosody\/modules\" }" /etc/prosody/prosody.cfg.lua

    service prosody start
fi

if [ $WITHOUTVIDEOBRIDGE ]
then
    echo "===================> Install VideoBridge <==================="
    cd ~

    if [ ! -d /etc/jitsi/videobridge ]
    then
        apt-get install -y jitsi-videobridge

        # To support larger number of participants we need to increase some numbers
        tee -a /etc/systemd/system.conf << EOF
DefaultLimitNOFILE=65000
DefaultLimitNPROC=65000
DefaultTasksMax=65000
EOF

        echo "jitsi-videobridge2 jitsi-videobridge/jvb-hostname string $DOMAIN" | debconf-set-selections
        apt-get install -y jitsi-videobridge2=2.1-157-g389b69ff-1
    fi

    echo "===================> VIDEOBRIDGE change config file <==================="
    sed -i "/JVB_HOSTNAME=/c\JVB_HOSTNAME=$DOMAIN" /etc/jitsi/videobridge/config
    sed -i "/JVB_HOST=/c\JVB_HOST=" /etc/jitsi/videobridge/config
    sed -i "/JVB_SECRET=/c\JVB_SECRET=$PROSODYPASSWORD" /etc/jitsi/videobridge/config
    sed -i "/JVB_OPTS=/c\JVB_OPTS=\"--apis=,\"" /etc/jitsi/videobridge/config

    echo "===================> VIDEOBRIDGE change sip-communicator.properties  <==================="
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
org.jitsi.videobridge.xmpp.user.shard.MUC_NICKNAME=$DOMAIN
" > /etc/jitsi/videobridge/sip-communicator.properties
fi

echo "===================> Install jicofo <==================="
cd ~

if [ ! -d /etc/jitsi/jicofo ]
then
  apt-get install -y jicofo
fi

echo "===================> JICOFO change config file <==================="
sed -i "/JICOFO_HOSTNAME=/c\JICOFO_HOSTNAME=$DOMAIN" /etc/jitsi/jicofo/config
sed -i "/JICOFO_AUTH_DOMAIN=/c\JICOFO_AUTH_DOMAIN=auth.$DOMAIN" /etc/jitsi/jicofo/config
sed -i "/JICOFO_SECRET=/c\JICOFO_SECRET=$PROSODYPASSWORD" /etc/jitsi/jicofo/config
sed -i "/JICOFO_AUTH_PASSWORD=/c\JICOFO_AUTH_PASSWORD=$PROSODYPASSWORD" /etc/jitsi/jicofo/config

echo "===================> JICOFO change sip-communicator.properties  <==================="
echo "org.jitsi.jicofo.BRIDGE_MUC=JvbBrewery@internal.auth.$DOMAIN" > /etc/jitsi/jicofo/sip-communicator.properties

echo "===================> PROSODY $DOMAIN create configuration file <==================="
if [ -f $PROSODYCONFIGPATH ]
then
    rm $PROSODYCONFIGPATH
    rm /var/lib/prosody/$DOMAIN.*
    rm /var/lib/prosody/auth.$DOMAIN.*
    rm /etc/prosody/certs/$DOMAIN.*
    rm /etc/prosody/certs/auth.$DOMAIN.*
    rm /usr/local/share/ca-certificates/auth.$DOMAIN.crt
fi

sudo cp "$INSTALLPATH/$DOMAIN/doc/debian/jitsi-meet-prosody/prosody.cfg.lua-jvb.example" $PROSODYCONFIGPATH

sudo sed -i "s/plugin_paths = { \"\/usr\/share\/jitsi-meet\/prosody-plugins\/\" }/plugin_paths = { \"\/srv\/$DOMAIN\/resources\/prosody-plugins\/\" }/g" $PROSODYCONFIGPATH
sudo sed -i "s/__turnSecret__/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/focusSecret/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/jvbSecret/$PROSODYPASSWORD/g" $PROSODYCONFIGPATH
sudo sed -i "s/jitmeet.example.com/$DOMAIN/g" $PROSODYCONFIGPATH

sed -i "/authentication/c\authentication = \"token\"" $PROSODYCONFIGPATH
sudo sed -i "s/appId/$APPID/g" $PROSODYCONFIGPATH
sudo sed -i "s/appSecret/$APPSECRET/g" $PROSODYCONFIGPATH

sudo ln -s $PROSODYCONFIGPATH /etc/prosody/conf.d/$DOMAIN.cfg.lua

echo "===================> Prosody generate keys for domain $DOMAIN and restart <==================="
service prosody restart

sudo prosodyctl cert generate $DOMAIN
sudo prosodyctl cert generate "auth.$DOMAIN"

ln -sf /var/lib/prosody/$DOMAIN.* /etc/prosody/certs/
ln -sf /var/lib/prosody/auth.$DOMAIN.* /etc/prosody/certs/

ln -sf /var/lib/prosody/auth.$DOMAIN.crt /usr/local/share/ca-certificates/auth.$DOMAIN.crt
update-ca-certificates -f
prosodyctl register focus auth.$DOMAIN $PROSODYPASSWORD
prosodyctl register jvb auth.$DOMAIN $PROSODYPASSWORD

cd ~/
echo "===================> PROSODY configure jitsi-meet-tokens  <==================="
if [ ! -f luarocks-2.4.1.tar.gz ]
then
echo "
deb http://ftp.us.debian.org/debian/ stretch main contrib non-free
deb http://ftp.us.debian.org/debian/ stretch-updates main contrib non-free
deb http://security.debian.org/debian-security/ stretch/updates main contrib non-free
" >> /etc/apt/sources.list

    apt-get update -y

    apt-get install liblua5.2-dev
    wget https://keplerproject.github.io/luarocks/releases/luarocks-2.4.1.tar.gz
    tar -xzf luarocks-2.4.1.tar.gz
    cd ./luarocks-2.4.1
    ./configure --lua-version=5.2 --versioned-rocks-dir
    make build
    sudo make install
    luarocks-5.2 install net-url
    luarocks-5.2 install basexx
    apt-get install libssl1.0-dev
    luarocks-5.2 install luajwtjitsi
    luarocks-5.2 install lua-cjson 2.1.0-1
fi

echo "===================> Configure nginx file with domain: $DOMAIN <==================="
if [ -f $NGINXCONFIGPATH ]
then
    rm $NGINXCONFIGPATH
    rm /etc/nginx/sites-enabled/$DOMAIN.conf
fi

cp -rf "$INSTALLPATH/$DOMAIN/doc/debian/jitsi-meet/jitsi-meet.example" $NGINXCONFIGPATH

sed -i "s/ssl_certificate \/etc\/jitsi\/meet\/jitsi-meet.example.com.crt;/ssl_certificate \/etc\/prosody\/certs\/$DOMAIN.crt;/g" $NGINXCONFIGPATH
sed -i "s/ssl_certificate_key \/etc\/jitsi\/meet\/jitsi-meet.example.com.key;/ssl_certificate_key \/etc\/prosody\/certs\/$DOMAIN.key;/g" $NGINXCONFIGPATH
sed -i "s/server_names_hash_bucket_size 64;/#server_names_hash_bucket_size 64;/g" $NGINXCONFIGPATH
sed -i "s/jitsi-meet.example.com/$DOMAIN/g" $NGINXCONFIGPATH
sed -i "s/\/usr\/share\/jitsi-meet/\/srv\/$DOMAIN/g" $NGINXCONFIGPATH
sed -i "s/\/etc\/jitsi\/meet/\/srv\/$DOMAIN/g" $NGINXCONFIGPATH

sudo ln -s $NGINXCONFIGPATH /etc/nginx/sites-enabled/$DOMAIN.conf

echo "===================> Install choopchat.tokenissuer.service <==================="

if [ ! -d /var/www/ChoopChat.TokenIssuer ]
then
  cd $INSTALLPATH/$DOMAIN/resources
  cp ./choopchat.tokenissuer.service /etc/systemd/system/
  systemctl daemon-reload
  systemctl enable choopchat.tokenissuer.service
  systemctl start choopchat.tokenissuer.service

  sudo deploy_tokenissuer.sh & wait
fi

echo "===================> Update current jitsi from git <==================="

cd $INSTALLPATH/$DOMAIN
git pull origin master & wait
sudo npm install & wait
sudo make & wait

sudo service nginx restart
sudo service prosody restart
sudo service jicofo restart
sudo service jitsi-videobridge2 restart

echo "===================> Installation finished <==================="
