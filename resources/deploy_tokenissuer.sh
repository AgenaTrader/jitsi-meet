systemctl stop choopchat.tokenissuer.service

mkdir /var/www/ChoopChat.TokenIssuer.Src
cd /var/www/ChoopChat.TokenIssuer.Src
# We have moved to GitLab, so we need t
git clone https://gitlab+deploy-token-1:DyPcepn9cGHs1un_Uxu9@repo.agenatrader.com/agenatrader-projects/choopchat.tokenissuer.git ./ --single-branch --branch develop
dotnet publish ChoopChat.TokenIssuer.sln --output=/var/www/build --configuration=Release
dotnet clean
cd ..
rm -rf ChoopChat.TokenIssuer/
mv build ChoopChat.TokenIssuer
rm -rf ChoopChat.TokenIssuer.Src/

systemctl start choopchat.tokenissuer.service
