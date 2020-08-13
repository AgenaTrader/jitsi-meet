#!/bin/bash

INSTALLPATH=$1
DOMAIN=$2

if [ -d "$INSTALLPATH/$DOMAIN" ]
then
    echo "Update current jitsi installation"
    cd "$INSTALLPATH/$DOMAIN"
    git fetch --all
    git reset --hard origin/develop
    git pull origin develop & wait
fi
