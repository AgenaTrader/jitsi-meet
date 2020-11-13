#!/bin/bash
echo "Install jicofo"
DOMAIN=$1
PROSODYPASSWORD=$2

JICOFO_VERSION='1.0-636-1'

cd ~

if [ ! -d /etc/jitsi/jicofo ]
then
  apt-get install -y jicofo=$JICOFO_VERSION
fi

echo "===================> JICOFO change config file <==================="
sed -i "/JICOFO_HOSTNAME=/c\JICOFO_HOSTNAME=$DOMAIN" /etc/jitsi/jicofo/config
sed -i "/JICOFO_AUTH_DOMAIN=/c\JICOFO_AUTH_DOMAIN=auth.$DOMAIN" /etc/jitsi/jicofo/config
sed -i "/JICOFO_SECRET=/c\JICOFO_SECRET=$PROSODYPASSWORD" /etc/jitsi/jicofo/config
sed -i "/JICOFO_AUTH_PASSWORD=/c\JICOFO_AUTH_PASSWORD=$PROSODYPASSWORD" /etc/jitsi/jicofo/config

echo "===================> JICOFO change sip-communicator.properties  <==================="
echo "org.jitsi.jicofo.BRIDGE_MUC=JvbBrewery@internal.auth.$DOMAIN" > /etc/jitsi/jicofo/sip-communicator.properties
