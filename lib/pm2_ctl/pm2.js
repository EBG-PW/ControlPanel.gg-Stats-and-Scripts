const pm2 = require('pm2')

/**
 * This function will resolve the PM2_IDs of the names
 * @param {Array} NameList
 * @returns Array
 */
let GetPM2IDByName = function(NameList) {
    return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
          
            pm2.list((err, list) => {
                if (err) {
                    reject(err);
                }
                let Filterd = list.filter(function (el) { return NameList.includes(el.name)});
                let FilterdIDs = [];
                Filterd.map(Data => {
                    FilterdIDs.push(Data.pm_id)
                })
                resolve(FilterdIDs)
            })
        })
    });
}

/**
 * This function will resolve with all informations about a prosess  
 * Works with IDs & Names  
 * @param {String | Number} proc
 * @returns Object
 */
let GetStatus = function(proc) {
    return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
          
            pm2.describe(proc, (err, process_data) => {
                if (err) {
                    reject(err);
                }
                resolve(process_data)
            })
        })
    });
}

/**
 * This function will resolve with all informations about all prosesses  
 * Works with IDs & Names  
 * @param {Array} proclist
 * @returns Object
 */
 let GetEveryStatus = function(proclist) {
    return new Promise(function(resolve, reject) {
        pm2.connect(function(err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
          
            pm2.list((err, list) => {
                if (err) {
                    reject(err);
                }
                let Filterd = list.filter(function (el) { return proclist.includes(el.name)});
                resolve(Filterd)
            })
        })
    });
}

module.exports = {
    GetPM2IDByName,
    GetStatus,
    GetEveryStatus
};
