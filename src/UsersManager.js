const oracledb = require('oracledb');
oracledb.autoCommit = true;
oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

class UsersManager {

    static async signUp({email, password}) {
        let connection;
        let reason;
        let successful = false;

        let matchedUsersQuery = `SELECT Email 
                                 FROM Users 
                                 WHERE Email='${email}'`
        let insertUserQuery = `INSERT INTO Users (Email, Password) 
                               VALUES ('${email}','${password}')`

        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection created successfully")

            let matchedUsersResult = await connection.execute(matchedUsersQuery);

            if (matchedUsersResult.rows.length > 0) {
                console.log(`User ${email} already exists`);
                reason = "USER_ALREADY_EXISTS";

            } else {
                let insertUserResult = await connection.execute(insertUserQuery);
                successful = insertUserResult.rowsAffected > 0;

                if (successful) {
                    successful = true;
                    console.log(`Sing up of ${email} was successful`);
                } else {
                    console.log(`Something went wrong, user not created AAA`);
                    reason = "NO_ROWS_AFFECTED";
                }
            }
        } catch (err) {
            successful = false;
            reason = err;
            console.log(`Something went wrong, user not created`);
            console.log(err)
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason};
    }

    static async logIn({email, password}) {
        let connection;
        let reason;
        let successful = false;

        let matchedUsersQuery = `SELECT Email, Password 
                                 FROM Users 
                                 WHERE Email='${email}'`

        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection created successfully")

            let matchedUsersResult = await connection.execute(matchedUsersQuery);

            if (matchedUsersResult.rows.length > 0) {
                let user = matchedUsersResult.rows[0];
                if (user[1] == password) {
                    successful = true;
                    console.log(`User ${email} logged in`);
                } else {
                    reason = "WRONG_PASSWORD"
                    console.log(`Wrong password for ${email}`);
                }
            } else {
                reason = "NO_USER_WITH_EMAIL"
                console.log(`There is no user with email: ${email}`);
            }
        } catch (err) {
            successful = false;
            reason = err;
            console.log(`Something went wrong, user not created`);
            console.log(err)
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason};
    }

    static async isAuthorized(auth) {
        let {successful} = await UsersManager.logIn(auth);
        return successful;
    }

}

module.exports = UsersManager;
