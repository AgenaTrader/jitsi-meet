#!/bin/bash

DOMAIN=$1

echo "Write domain to host file"

if [ -n "$(grep $DOMAIN /etc/hosts)" ]
then
    echo "$DOMAIN already exists"
else
    if [ -n "$(grep $DOMAIN /etc/hosts)" ]
    then
        echo "$DOMAIN was added succesfully";
    else
        echo "Failed to add $DOMAIN, try again!";
    fi
fi
