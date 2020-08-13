#!/bin/bash

INSTALL_VIDEOBRIDGE=$1
DOMAIN=$2
PROSODYPASSWORD=$3

if [ $INSTALL_VIDEOBRIDGE ]
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
