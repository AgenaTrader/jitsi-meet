#!/bin/bash
echo ""
echo "Start installation nginx"
INSTALLPATH=$1
DOMAIN=$2
NGINXCONFIGPATH=/etc/nginx/sites-available/$DOMAIN.conf


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

echo ""
echo "Configure nginx file with domain: $DOMAIN"
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

# Remove default nginx configuration, so users don't end up there for some reason
sudo rm /etc/nginx/sites-enabled/default

# TODO: Add a default catch-all config that will redirect to jitsi installation
