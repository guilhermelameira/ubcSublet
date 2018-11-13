var oracledb = require('oracledb');
var dbConfig = require('../dbconfig.js');

class API {

    static echo(data) {
        return data;
    }

    static singUp({email, password}) {
        // TODO: Do the sign up


        let sql = `create table users
                    (email 		varchar(100) 	not null,
                     password 	varchar(50)     not null,
                     primary key (email))`;


        oracledb.getConnection(
            {
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString
            },
            function (err, connection) {
                if (err) {
                    console.error("DID not work");
                    console.error(err.message);
                    return;
                }

                connection.execute(sql, function (err, result) {
                    if (err) {
                        console.error(err.message);
                        //doRelease(connection);
                        return;
                    }

                    console.log("YESSSSSSS");
                    console.log(result.metaData);
                    console.log(result.rows);
                    //doRelease(connection);
                })
            });


        let sqlQuery = `INSERT INTO User (Email, Password)
                          VALUES ("${email}","${password}");`
        return {sqlQuery};
    }

    static logIn({email, password}) {
        // TODO: Do the logIn

        let sqlQuery = `SELECT Email, Password
                        FROM User;
                        WHERE Email="${email}" AND Password="${password}"`

        return {sqlQuery};
    }

}

module.exports = API;
