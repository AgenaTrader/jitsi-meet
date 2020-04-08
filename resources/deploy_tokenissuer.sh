systemctl stop choopchat.tokenissuer.service

mkdir /var/www/ChoopChat.TokenIssuer.Src
cd /var/www/ChoopChat.TokenIssuer.Src
git clone https://repo.agenatrader.com/AgenaTrader-Projects/ChoopChat.TokenIssuer ./ --single-branch --branch develop
dotnet publish ChoopChat.TokenIssuer.sln --output=/var/www/build --configuration=Release
dotnet clean
cd ..
rm -rf ChoopChat.TokenIssuer/
mv build ChoopChat.TokenIssuer
rm -rf ChoopChat.TokenIssuer.Src/

systemctl start choopchat.tokenissuer.service