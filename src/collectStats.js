const geoip = require('geoip-country');
const db = require('../lib/db/mysql');
const pterostatus = require('../lib/pterostatus')
const DBDelay = Number(process.env.CheckDelayInMS) / 1000;

let StatsCollector = function () {
    return new Promise(function (resolve, reject) {
        const Promisees = [db.GetAllUsers(), db.GetAllServers(), db.GetAllProducts(), db.GetFailedJobsSinceLastCheck(DBDelay)];

        if (process.env.PteroStatusURL) {
            Promisees.push(pterostatus.GetPteroStatusData())
        }

        try {
            Promise.all(Promisees).then(function (values) {
                const Users = values[0];
                const Servers = values[1];
                const Products = values[2];
                const FailedJobs = values[3];
                let PteroStatusData = {};
                if (process.env.PteroStatusURL) {
                    PteroStatusData = values[values.length - 1];
                }

                let [TotalCoins, TotalSuspendedUsers, TotalAllowedServers, TotalVerifiedUsers, TotalVerifiedDiscordUsers, TotalCPU, TotalRAM, TotalSWAP, TotalDisk, TotalAllocations, TotalDB, TotalServerCostMonthly, ServerSuspended] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let UserCountrys = [];
                let ServerProducts = [];

                Users.map(function (User) {
                    if (User.suspended === 0) {
                        if (process.env.ExcludeAdminCoins !== 'true' || User.role !== "admin") {
                            TotalCoins += User.credits;
                        }
                        TotalAllowedServers += User.server_limit;

                        if (User.email_verified_at !== null) {
                            TotalVerifiedUsers += 1;
                        }

                        if (User.discord_verified_at !== null) {
                            TotalVerifiedDiscordUsers += 1;
                        }

                        if (User.ip !== null && geoip.lookup(User.ip)) {
                            UserCountrys.push(geoip.lookup(User.ip).country);
                        } else {
                            UserCountrys.push("Local");
                        }

                    } else {
                        TotalSuspendedUsers += 1;
                    }
                });

                Servers.map(function (Server) {
                    if (Server.suspended === null) {
                        Products.map(function (Product) {
                            if (Server.product_id === Product.id) {
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
                    } else {
                        ServerSuspended += 1;
                    }
                });

                const UserCountrysObject = UserCountrys.reduce(function (acc, curr) {
                    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
                }, {})

                const ServerProductsObject = ServerProducts.reduce(function (acc, curr) {
                    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
                }, {})

                let ExportStats = {
                    Users: {
                        TotalUsers: Users.length,
                        TotalCoins: TotalCoins,
                        TotalSuspendedUsers: TotalSuspendedUsers,
                        TotalAllowedServers: TotalAllowedServers,
                        TotalVerifiedUsers: TotalVerifiedUsers,
                        TotalVerifiedDiscordUsers: TotalVerifiedDiscordUsers,
                        CountrysCount: Object.keys(UserCountrysObject).length

                    },
                    Servers: {
                        TotalServers: Servers.length,
                        TotalServerSuspended: ServerSuspended,
                        TotalCPU: TotalCPU,
                        TotalRAM: TotalRAM,
                        TotalSWAP: TotalSWAP,
                        TotalDisk: TotalDisk,
                        TotalDB: TotalDB,
                        TotalAllocations: TotalAllocations,
                        TotalServerCostMonthly: TotalServerCostMonthly,
                        ProductsCountInUse: Object.keys(ServerProductsObject).length,
                        ProductsCount: Products.length
                    },
                    Countrys: UserCountrysObject,
                    Products: ServerProductsObject,
                    Jobs: {
                        Failed: (FailedJobs !== "None") ? FailedJobs[0]['COUNT(*)'] : 0,
                    }
                }

                if (process.env.PteroStatusURL) {
                    ExportStats["PteroStatus"] = PteroStatusData;
                }

                resolve(ExportStats);
            }).catch(function (err) {
                console.log(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    StatsCollector
}