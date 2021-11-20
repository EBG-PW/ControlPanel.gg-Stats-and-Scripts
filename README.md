# ControlPanel.gg-Stats-and-Scripts
 Grafana Monitoring Script and general scrips

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
