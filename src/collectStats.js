const geoip = require('geoip-country');
const db = require('../lib/db/mysql');
const DBDelay = Number(process.env.CheckDelayInMS)/1000;

let StatsCollector = function() {
	return new Promise(function(resolve, reject) {
        const Promisees = [db.GetAllUsers(), db.GetAllServers(), db.GetAllProducts(), db.GetFailedJobsSinceLastCheck(DBDelay)];

        Promise.all(Promisees).then(function(values) {
            const Users = values[0];
            const Servers = values[1];
            const Products = values[2];
            const FailedJobs = values[3];

            let [TotalCoins, TotalSuspendedUsers, TotalAllowedServers, TotalVerifiedUsers, TotalVerifiedDiscordUsers, TotalCPU, TotalRAM, TotalSWAP, TotalDisk, TotalAllocations, TotalDB, TotalServerCostMonthly] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let UserCountrys = [];
            let ServerProducts = [];

            Users.map(function(User) {
                if(User.suspended === 0){
                    TotalCoins += User.credits;
                    TotalAllowedServers += User.server_limit;

                    if(User.email_verified_at !== null){
                        TotalVerifiedUsers += 1;
                    }

                    if(User.discord_verified_at !== null){
                        TotalVerifiedDiscordUsers += 1;
                    }

                    if(User.ip !== null){
                        UserCountrys.push(geoip.lookup(User.ip).country);
                    }
                }else{
                    TotalSuspendedUsers += 1;
                }
            });

            Servers.map(function(Server) {
                Products.map(function(Product) {
                    if(Server.product_id === Product.id){
                        TotalCPU += Product.cpu;
                        TotalRAM += Product.memory;
                        TotalSWAP += Product.swap;
                        TotalDisk += Product.disk;
                        TotalDB += Product.databases;
                        TotalAllocations += Product.allocations;
                        TotalServerCostMonthly += Product.price;
                        ServerProducts.push(Product.name);
                    }
                })
            });

            resolve({
                Users: {
                    Total: Users.length,
                    TotalCoins: TotalCoins,
                    TotalSuspendedUsers: TotalSuspendedUsers,
                    TotalAllowedServers: TotalAllowedServers,
                    TotalVerifiedUsers: TotalVerifiedUsers,
                    TotalVerifiedDiscordUsers: TotalVerifiedDiscordUsers,
                    Countrys: UserCountrys.reduce(function (acc, curr) {
                        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
                    }, {}),
                    CountrysCount: UserCountrys.length
                },
                Servers: {
                    Total: Servers.length,
                    TotalCPU: TotalCPU,
                    TotalRAM: TotalRAM,
                    TotalSWAP: TotalSWAP,
                    TotalDisk: TotalDisk,
                    TotalDB: TotalDB,
                    TotalAllocations: TotalAllocations,
                    TotalServerCostMonthly: TotalServerCostMonthly,
                    Products: ServerProducts.reduce(function (acc, curr) {
                        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
                    }, {}),
                    ProductsCount: ServerProducts.length
                },
                Jobs: {
                    Failed: FailedJobs[0]['COUNT(*)'],
                }
            });
        }).catch(function(err) {
            console.log(err);
        });
    });
}

module.exports = {
    StatsCollector
}