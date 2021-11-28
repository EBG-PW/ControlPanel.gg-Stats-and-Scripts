# ControlPanel.gg-Stats-and-Scripts
 Grafana Monitoring Script and general scrips

# Stats
Will push data to a Influx 2.0 DB so you can use it as grafana source.  

## Setup on Ubuntu/Debian
### Required
- Influx DB
- Grafana
- NodeJS & PM2

### Influx DB Setup
```sh
docker run -p 8086:8086 \
-v influxdb2:/var/lib/influxdb2 \
influxdb:2.0
```

### Grafana Setup
```sh
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

### NodeJS & PM2 Setup
```sh
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y
npm i pm2 -g
pm2 startup
```



# Scripts

| Name  | Function | MySQL Root| Usage |
| ------------- | ------------- | ------------- | ------------- |
| Transfer Users  | Move users from pterodactyl to controlpanel  | Recommended | npm run transfer |

## Skript Transfer Users
This script will move all non admin users from your existing pterodactyl installation to controlpanel.  
It will keep the same login information, users just have to verify e-mail (if you requiere). Those emails will not be send by this script!  
Its recommented to use root MYSQL user, but you can also use a user with dump permissions and pterodactyl DB + Contropanel DB permission.  
This script will ONLY work on instalation with DEFAULT database names:  
Pterodactyl: panel  
Controlpanel: dashboard  
If you want to use diffrent DB names, you have to modify the script.  
![grafik](https://user-images.githubusercontent.com/35345288/142738167-358c14a8-02f1-43c4-b522-d1fa7c3d3dc9.png)
