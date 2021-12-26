const mysql = require("mysql");

const db = mysql.createPool({
	connectionLimit : 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	charset : "utf8mb4"
});
/* Wait untill i understand how that tale works
let GetCurrentJobs = function() {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query('SELECT COUNT(*) FROM jobs;', function(err, rows, fields) {
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}*/

let GetFailedJobsSinceLastCheck = function(TimeCheckInterval) {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query(`SELECT COUNT(*) FROM dashboard.failed_jobs WHERE failed_at >= NOW() - INTERVAL ${TimeCheckInterval} Second;`, function(err, rows, fields) {
                if(err){
                    console.log(err);
                }
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}

let GetAllUsers = function() {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query('SELECT credits, server_limit, email_verified_at, discord_verified_at, ip, suspended FROM users;', function(err, rows, fields) {
                if(err){
                    console.log(err);
                }
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}

let GetAllServers = function() {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query('SELECT pterodactyl_id, product_id, suspended FROM servers;', function(err, rows, fields) {
                if(err){
                    console.log(err);
                }
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}

let GetAllProducts = function() {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query('SELECT id, name, price, memory, cpu, swap, disk, `databases`, backups, allocations FROM products;', function(err, rows, fields) {
                if(err){
                    console.log(err);
                }
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}

let GetVouchersAndUsage = function() {
	return new Promise(function(resolve, reject) {
		db.getConnection(function(err, connection){
			connection.query('WITH voucher_data as ( SELECT uses as max_uses, id, credits, code, memo, expires_at, created_at, updated_at, uses as uses_total FROM dashboard.vouchers GROUP BY id ), voucher_uses as ( SELECT COUNT(*) as uses, voucher_id FROM dashboard.user_voucher GROUP BY voucher_id ) SELECT (voucher_data.max_uses - voucher_uses.uses) as uses_left, voucher_data.uses_total, voucher_data.id as voucher_id, voucher_data.credits, voucher_data.code, voucher_data.memo, voucher_data.expires_at, voucher_data.created_at, voucher_data.updated_at FROM voucher_data INNER JOIN voucher_uses ON voucher_data.id = voucher_uses.voucher_id', function(err, rows, fields) {
                if(err){
                    console.log(err);
                }
				connection.release();
				if(Object.entries(rows).length === 0){
					reject(0);
				}else{
					resolve(rows);
				}
			});
		});
	});
}

module.exports = {
    GetFailedJobsSinceLastCheck,
    GetAllUsers,
    GetAllServers,
    GetAllProducts,
	GetVouchersAndUsage
}