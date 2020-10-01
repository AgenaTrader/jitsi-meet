# How to Install using install-jitsi.sh

The installation script is the only file you need to start.
How you get it to the server is up to you.

**Prerequisites**

0. Debian 10 (Buster) with root access
0. Public IP (or you can figure out how to proxy Jitsi installation and JVB)
0. Configure DNS for the domain name you want to use (probably on godaddy.com)
0. Kallithea account with access to https://repo.agenatrader.com/AgenaTrader-Projects/ChoopChat.TokenIssuer

**Steps**

0. Clone this repo to your PC
0. Copy `install-jitsi.sh` to the server with SCP
0. Run the `install-jitsi.sh` script and follow the instructions
0. Install certbot from https://certbot.eff.org/lets-encrypt/debianbuster-nginx
0. Run `certbot --nginx`

