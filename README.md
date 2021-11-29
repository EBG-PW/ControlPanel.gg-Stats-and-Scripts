# ControlPanel.gg-Stats-and-Scripts
 Grafana Monitoring Script and general scrips

# Stats
Will push data to a Influx 2.0 DB so you can use it as grafana source.  

![grafik](https://user-images.githubusercontent.com/35345288/143792952-34173d4c-ad4b-4e54-8c2e-57d145c0ac89.png)


## Setup on Ubuntu/Debian
### Required
- Influx DB
- Grafana
- NodeJS & PM2

### Install Docker (optional)
If you have docker installed already, you can skip this
```sh
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
systemctl enable --now docker
```

### Influx DB Setup (as Docker)
```sh
docker run -d -p 8086:8086 \
--name=InfluxDB \
-v influxdb2:/var/lib/influxdb2 \
influxdb:2.0
```

### Grafana Setup (as Docker)
```sh
docker run -d --name=grafana \
-p 3000:3000 \
grafana/grafana
```

### NodeJS & PM2 Setup
```sh
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y
npm i pm2 -g
pm2 startup
```

## Configuration

### Configuration Influx DB
1. Go to `Server IP:8086` in your Browser and click "Get Started".  
2. Setup a username & password.  
3. Setup your organisation and your first bukket. You´ll need that later!  
4. Click on "Setup later" on the next Step.  

### Configuration Grafana
1. Go to `Server IP:3000` in your Browser and log in with Username/Password: admin/admin     
2. It will ask you to setup a new password.    
3. Click on configuration and then datacources then add data source.  
4. Select InfluxDB.
5. Select Flux as your Query Language.
6. Write your `http://serverip:port` into the URL field.  
7. Fill out your Organization, Default Bucket and write for "Min time interval" 1s  
8. Go back to your InfluxDb webpanel, click on "Data" then "Tokens" then on your Token and copy that.  
9. Paste this token into the field "Token" in the grafana config.  
10. Click save&test. It should say "X Buckets found", if it shows an error check your config.  

### Setup & run the software
It is recommendet you run this software on the same server as you run the MySQL DB for your pterodactyl and controlpanel.gg installtion.
1. Clone the repo to your server, you can change the path.
```sh
git clone https://github.com/EBG-PW/ControlPanel.gg-Stats-and-Scripts.git /etc/ControlPanelStats/ && cd /etc/ControlPanelStats/
```
2. Rename the .env.example and edit it
```sh
mv ./.env.example ./.env && nanoe .env
```
3. Write the DB Credentials & InfluxDB Data
```env
DB_HOST=localhost
DB_USER=dashboarduser
DB_PASSWORD=mysecretpassword
DB_DATABASE=dashboard
CheckDelayInMS=10000

Influx_Host=InfluxDB Ip
Influx_Protocol=http
Influx_Port=8086
Influx_Token=The token that you put into grafana data source

orga=YourOrga
bucket=YourDefaultBucket
host=Dashboard
```
4. Install node modules and setup pm2
```sh
npm i
node PM2_Setup.js
pm2 save
```
5. for the grafana dashboard, click on Dasboards->Manage->Import and paste the json found in `Dashboards/Example Dashboard`
6. You´ll need to make some ajustments in each panel because the names are dynamic and will differ from my names.

# See logs and status
To see if the software is running, you can use the command `pm2 monit` and look for 'ControlPanel.gg Stats'.   There you can see CPU / RAM usage, the current log, the restarts and other performance metrics.  

# Add live usage data with Pterostatus
1. Follow installation of [Ptero-Status](https://github.com/BlueFox-Development/Ptero-Status)
2. Write the url (localhost if installed localy) into the .env "PteroStatusURL"  
3. Optional: If you setup Token auth (recommended) you have to write the token after PteroStatusToken=  
4. Restart the software (pm2 restart "ControlPanel.gg Stats")  
5. Make sure you use the example dashboard with livestats OR edit your current dashbord.  

# Modify Grafana Dashboard
If you don´t know Flux Query language used by InflixDB2 you can always go to your InfluxDB Webpanel and use the GUI under the "Explore" tab.  
After you have the graph you wanted, click on "Script editor" and paste the code into the grafana query field.

# Scripts

| Name  | Function | MySQL Root| Usage |
| ------------- | ------------- | ------------- | ------------- |
| Transfer Users  | Move users from pterodactyl to controlpanel  | Recommended | npm run transfer |

## Skript Transfer Users
### Functionality
This script will move all non admin users from your existing pterodactyl installation to controlpanel.  
It will keep the same login information, users just have to verify e-mail (if you requiere). `Those emails will not be send by this script!`  
### Usage
Its recommented to use root MYSQL user, but you can also use a user with dump permissions and pterodactyl DB + Contropanel DB permission.  
This script will ONLY work on instalation with DEFAULT database names:  
Pterodactyl: panel  
Controlpanel: dashboard  
If you want to use diffrent DB names, you have to modify the script.  
![grafik](https://user-images.githubusercontent.com/35345288/142738167-358c14a8-02f1-43c4-b522-d1fa7c3d3dc9.png)
