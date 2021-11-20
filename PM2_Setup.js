const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }
  
  Promise.all([newPM2_Instance('./index.js', 'ControlPanel.gg Stats')]).then((values) => {
    pm2.list((err, list) => {
      let substractor = 0
      list.map(Instance => {
        if(Instance.name === "ControlPanel.gg Stats"){
          substractor++
        console.log(`Started ${Instance.name} with status ${Instance.pm2_env.status}`)
        }
      })
      console.log(`There are ${list.length - substractor} other PM2 prosesses on this computer`)
        pm2.disconnect()
        process.exit(2)
    })
  });
})

function newPM2_Instance(app, name){
    return new Promise(function(resolve, reject) {
        pm2.start({
            script    : app,
            name      : name
        }, function(err, apps) {
            if (err) {
                console.error(err)
                reject(err)
            }
            resolve(apps)
        })
    });
}