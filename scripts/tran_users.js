const readline = require('readline');
const fs = require("fs");
const path = require('path');
const rootPath = path.join(__dirname, '../');
const child_process = require('child_process');
const mysql = require("mysql");

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

let CreateBackupPromise = function() {
	return new Promise(function(resolve, reject) {
        child_process.execSync('mysqldump -u root --all-databases --single-transaction --quick --lock-tables=false --result-file=/root/backup.sql');
        resolve();
    })
}

/* Questions */
async function Start() {
    const MySQLRoot = await askQuestion("Whats your MySQL/MariaDB root password?> ");
    const Creadits = await askQuestion("How many Credits should the moved users get?> ");
    const ServerLimit = await askQuestion("What should the Server Limit of the moved users be?> ");
    const CreateBackup = await askQuestion("Should a backup be created? (y/n)> ");

    if (CreateBackup.toLowerCase() === "y") {  
        //Check if File exists
        if(fs.existsSync(`/root/.my.cnf`)) {
            fs.rename('/root/.my.cnf', '/root/.my.cnf.old', function(err) {
                if ( err ) console.log('ERROR: ' + err);
                console.log('[Backup] \x1b[36m[I]\x1b[0m',`.my.cnf File was found and renamed`)
            });
        }

        const FileT = `[mysqldump]\nuser=root\npassword=${MySQLRoot}`;
        fs.writeFile(`/root/.my.cnf`, FileT, function(err) {
            if ( err ) console.log('ERROR: ' + err);
            console.log('[Backup] \x1b[36m[I]\x1b[0m',`Created .my.cnf File`)

            CreateBackupPromise().then(() => {
                console.log('[Backup] \x1b[36m[I]\x1b[0m',`Backup created`)
                
                fs.unlink(`/root/.my.cnf`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                    console.log('[Backup] \x1b[36m[I]\x1b[0m',`Removed .my.cnf File`)
                    fs.rename('/root/.my.cnf.old', '/root/.my.cnf', function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                        console.log('[Backup] \x1b[36m[I]\x1b[0m',`.my.cnf.old File was found and renamed`)
                    });
                });
            })
        });
    }

    var panel_db = mysql.createPool({
        connectionLimit : 100,
        host: 'localhost',
        user: 'root',
        password: MySQLRoot,
        database: 'panel',
        charset : "utf8mb4"
    });

    var control_db = mysql.createPool({
        connectionLimit : 100,
        host: 'localhost',
        user: 'root',
        password: MySQLRoot,
        database: 'dashboard',
        charset : "utf8mb4"
    });

    const getAllPteroUsers = "SELECT name_first, email, password, root_admin, id  FROM panel.users;";
    const getAllDashbordUsers = "SELECT email FROM dashboard.users;";
    const writeAllPreoUsers = "REPLACE INTO dashboard.users (name, role, email, password, pterodactyl_id, credits, server_limit, suspended, updated_at, created_at) VALUES ?";
    let AlreadyUsers = [];

    panel_db.getConnection(function(err, Pconnection) {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        control_db.getConnection(function(err, connection) {
            if (err) {
                console.error(err);
                process.exit(2);
            }
            connection.query(getAllDashbordUsers, function(err, rows) {
                if (err) {
                    console.error(err);
                    process.exit(2);
                }
                connection.release();
                rows.forEach(function(row) {
                    AlreadyUsers.push(row.email);
                });

                Pconnection.query(getAllPteroUsers, function(err, rows) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    Pconnection.release();
                    rows.forEach(function(P_row) {
                        if(P_row.root_admin === 1){
                            console.log(`[\x1b[31m[X]\x1b[0m]`,`User ${P_row.name_first} is a root admin and can't be moved`);
                        } else {
                            if(AlreadyUsers.includes(P_row.email)){
                                console.log(`[\x1b[31m[X]\x1b[0m]`,`User ${P_row.email} already exists`);
                            } else {
                                control_db.getConnection(function(err, connection) {
                                    if (err) {
                                        console.error(err);
                                        process.exit(2);
                                    }
                                    connection.query(writeAllPreoUsers, [[[P_row.name_first, "member", P_row.email, P_row.password, P_row.id, Creadits, ServerLimit, 0, new Date(), new Date()]]], function(err, rows) {
                                        if (err) {
                                            console.error(err);
                                            process.exit(2);
                                        }
                                        connection.release();
                                        console.log(`[\x1b[32m[+]\x1b[0m]`,`User ${P_row.name_first} was moved`);
                                    });
                                });
                            }
                        }
                    });
                });
            });
        });
    });
} 

Start()