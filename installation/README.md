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
0. Run the `install-jitsi.sh` script and follow the instructions.
    - You will be asked for a domain name 2 times. Use the same domain.
    - You will be asked for APP ID and APP SECRET - go with the **defaults**. We will change them later.
    - Prosody installation will ask for a **secret**
0. Install certbot from https://certbot.eff.org/lets-encrypt/debianbuster-nginx
0. Run `certbot --nginx` (use _infra@agenatrader.com_ as email). Say **yes** to redirects.
0. Edit prosody conf and set proper APP_ID and APP_SECRET. `vim /etc/prosody/conf.avail/choop.chat.cfg.lua`
0. Configure TokenIssuer
    `vim /var/www/ChoopChat.TokenIssuer/appsettings.json`
0. Restart TokenIssuer with
    ` service choopchat.tokenissuer restart`

** for some reason if you set this to anything else than "secret" there is a problem with JWT auth...
Changint the password later works fine tough.

## Troubleshooting

First of all, check chrome dev console for possible errors reported by frontend.
You should also watch following logs:
- `/var/log/jitsi/jvb.log`
- `/var/log/jitsi/jicofo.log`

### Conference is Disconnecting on join

Most likely the JVB is dead or not configured properly.

0. Check if `jitsi-videobridge2` service is running
0. Make sure `jitsi-videobridge2` version is up to date / compatible with jicofo
   - To check installed version: `apt-cache policy jitsi-videobridge2`
   - To change the version: update `videobridge.sh` script


