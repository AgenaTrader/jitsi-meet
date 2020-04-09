#!/bin/bash

if [ -d "$INSTALLPATH/$DOMAIN" ]
then
    echo "Update current jitsi installation"
    cd "$INSTALLPATH/$DOMAIN"
    git reset --soft HEAD~
    git pull origin master & wait
fi
