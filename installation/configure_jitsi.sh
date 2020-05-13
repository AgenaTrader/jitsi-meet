#!/bin/bash

INSTALLPATH=$1
DOMAIN=$2

echo "Start jitsi configuration"
cd $INSTALLPATH/$DOMAIN
cp -rf ./config.js "./$DOMAIN-config.js"
sed -i "s/domain: 'choop.chat',/domain: '$DOMAIN',/gi" "./$DOMAIN-config.js"
sed -i "s/bridge: 'jitsi-videobridge.choop.chat',/\/\/ bridge: 'jitsi-videobridge.$DOMAIN',/gi" "./$DOMAIN-config.js"
sed -i "s/muc: 'conference.choop.chat'/muc: 'conference.$DOMAIN'/gi" "./$DOMAIN-config.js"
