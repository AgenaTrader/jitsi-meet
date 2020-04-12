#!/bin/bash

echo "Restart services"
sudo service nginx restart
sudo service prosody restart
sudo service jicofo restart
sudo service jitsi-videobridge2 restart
