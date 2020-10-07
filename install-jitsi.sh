#!/bin/bash

if [[ "$EUID" -ne 0 ]]; then
	echo -e "Sorry, you need to run this as root"
	exit 1
fi

DEFAULT_DOMAIN=${PWD##*/}
DEFAULT_INSTALLPATH="/srv"
DEFAULT_PROSODYPASSWORD="choopchat"

clear

echo ""
echo "Installation jitsi script."
echo ""
echo "What do you want to do?"
echo "   1) Install Jitsi or update configs"
echo "   2) Update source code and recompile"
echo "   3) Restart serices"
echo "   4) Exit"
echo ""
while [[ $OPTION != 1 && $OPTION != 2 && $OPTION != 3 && $OPTION != 4 ]]; do
  read -p "Select an option [1-4]: " OPTION
done

if [[ $OPTION == 1 || $OPTION == 2 ]]; then
    echo -n "Please enter your domain (default: $DEFAULT_DOMAIN): "
    read DOMAIN

    if [[ "$DOMAIN" == "" ]]; then
      DOMAIN=$DEFAULT_DOMAIN
      echo "Used default domain: $DOMAIN"
    fi

    echo -n "Please enter your installation path (default: $DEFAULT_INSTALLPATH): "
    read INSTALLPATH

    if [[ "$INSTALLPATH" == "" ]]; then
      INSTALLPATH=$DEFAULT_INSTALLPATH
      echo "Used default installation directory: $INSTALLPATH"
    fi
    sudo mkdir $INSTALLPATH
fi


case $OPTION in
  1)
    echo -n "Please enter your prosody password (default: $DEFAULT_PROSODYPASSWORD): "
    read PROSODYPASSWORD

    if [[ "$PROSODYPASSWORD" == "" ]]; then
      PROSODYPASSWORD=$DEFAULT_PROSODYPASSWORD
      echo "Used default prosody password: $PROSODYPASSWORD"
    fi

    echo -n "Please enter your authorization token APP_ID: "
    read APPID

    if [[ "$APPID" == "" ]]; then
      APPID="1111111111"
      echo "Used default authorization APP_ID: $APPID"
    fi

    echo -n "Please enter your authorization token APP_SECRET: "
    read APPSECRET

    if [[ "$APPSECRET" == "" ]]; then
      APPSECRET="secret"
      echo "Used default authorization APP_SECRET: $APPSECRET"
    fi

    echo -n "Need install jitsi-videobridge2? (y/n) "
    read installjvb

    case "$installjvb" in
        y|Y)
          INSTALL_VIDEOBRIDGE=true
            ;;
        *)
          INSTALL_VIDEOBRIDGE=false
            ;;
    esac

    echo -n "Installing jitsi-videobridge2 status: $INSTALL_VIDEOBRIDGE"

    echo ""
    read -n1 -r -p "Press any key to continue..."
    echo ""

    echo "Start installation required packages: unzip git curl make default-jdk maven gnupg2 apt-transport-https lsof vim jq"
    sudo apt-get update -y
    sudo apt install -y sudo unzip git curl make default-jdk maven gnupg2 apt-transport-https lsof vim jq certbot python-certbot-nginx
    sudo apt-get update -y

    echo 'deb https://download.jitsi.org stable/' >> /etc/apt/sources.list.d/jitsi-stable.list
    wget -qO -  https://download.jitsi.org/jitsi-key.gpg.key | apt-key add -
    sudo apt-get update -y

    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/update_jitsi.sh" $INSTALLPATH $DOMAIN

    if [ ! -d "$INSTALLPATH/$DOMAIN" ]
    then
        echo "Download and install jitsi from jitsi-meet"
        cd $INSTALLPATH
        git clone https://github.com/AgenaTrader/jitsi-meet.git & wait
        cd ./jitsi-meet
        git checkout develop & wait

        sudo mv $INSTALLPATH/jitsi-meet $INSTALLPATH/$DOMAIN
    fi

    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/configure_jitsi.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/domain.sh" $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/nginx.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/node.sh"
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/npm.sh"
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/prosody.sh" $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/videobridge.sh" $INSTALL_VIDEOBRIDGE $DOMAIN $PROSODYPASSWORD
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/jicofo.sh" $DOMAIN $PROSODYPASSWORD
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/configure_prosody.sh" $DOMAIN $PROSODYPASSWORD $INSTALLPATH $APPID $APPSECRET
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/tokenissuer.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/compile.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/update_services.sh"

    echo "Installation finished"

    echo ""
    read -n1 -r -p "Press any key to exit..."
    echo ""

    exit;
  ;;
  2)
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/update_jitsi.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/configure_jitsi.sh" $INSTALLPATH $DOMAIN
    sudo /bin/bash "$INSTALLPATH/$DOMAIN/installation/compile.sh" $INSTALLPATH $DOMAIN
    exit
  ;;
  3)
    echo "Restart services"
    sudo service nginx restart
    sudo service prosody restart
    sudo service jicofo restart
    sudo service jitsi-videobridge2 restart
    exit
  ;;
  *)
    exit
  ;;

esac
