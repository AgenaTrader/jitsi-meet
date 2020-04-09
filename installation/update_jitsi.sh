#!/bin/bash

INSTALLPATH=$1
DOMAIN=$2

if [ -d "$INSTALLPATH/$DOMAIN" ]
then
    echo "Update current jitsi installation"
    cd "$INSTALLPATH/$DOMAIN"
    git fetch
    git reset --hard HEAD
    git pull origin develop & wait
fi
