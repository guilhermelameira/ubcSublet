const oracledb = require('oracledb');
const connectionInfo = require('./Resources/ConnectionInfo');
oracledb.autoCommit = true;

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
            console.log("Connection created successfully");

            let matchedUsersResult = await connection.execute(matchedUsersQuery);

            if (matchedUsersResult.rows.length > 0) {
                console.log(`User ${email} already exists`);
                reason = "USER_ALREADY_EXISTS";

            } else {
                let insertUserResult = await connection.execute(insertUserQuery);
                successful = insertUserResult.rowsAffected > 0;

                if (successful) {
                    successful = true;
                    console.log(`Sign up of ${email} was successful`);
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

    static async getSubleteeInfo({email}) {
        let connection;
        let reason;
        let successful = false;
        let firstName;
        let lastName;
        let contactDescription;

        let getSubleteeInfoQuery = `SELECT*
                                     FROM SubleteeInfos
                                     WHERE Email='${email}'`

        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Getting subletee info");

            let getSubleteeInfoResult = await connection.execute(getSubleteeInfoQuery);

            successful = getSubleteeInfoResult.rows.length > 0;

            if (successful) {
                console.log(`Subletee Info fetched successfully`);

                let subleteeInfoArray = getSubleteeInfoResult.rows[0];


                firstName = subleteeInfoArray[1];
                lastName = subleteeInfoArray[2];
                contactDescription = subleteeInfoArray[3];




            } else {
                console.log(`Something went wrong, could not find subletee info`);
                reason = "SUBLETEEINFO_DOES_NOT_EXIST";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, contact info not created`);
            console.log(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason, firstName, lastName, contactDescription};
    }

    static async addContactInfo({email, firstName, lastName, contactInfo}) {
        let connection;
        let reason;
        let successful = false;

        if (!firstName || !lastName) {
            reason = "FIRST_AND_LAST_NAMES_MUST_HAVE_VALUES";
            return {successful, reason};
        }

        let insertContactInfoQuery = `INSERT INTO SubleteeInfos (Email, Firstname, Lastname, ContactDescription)
                                      VALUES ('${email}','${firstName}','${lastName}', ${contactInfo ? `'${contactInfo}'` : 'NULL'})`

        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Attempting contact info addition");

            let insertContactInfoResult = await connection.execute(insertContactInfoQuery);

            successful = insertContactInfoResult.rowsAffected > 0;

            if (successful) {
                console.log(`Insert of contact info successful`);
            } else {
                console.log(`Something went wrong, contact info not created`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, contact info not created`);
            console.log(err);
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

    static async editContactInfo({email, firstName, lastName, contactInfo}) {
        let connection;
        let reason;
        let successful = false;

        if (!firstName && !lastName && !contactInfo) {
            reason = "NO_VALUE_GIVEN_FOR_A_FIELD";
            return {successful, reason};
        }

        let updateContactInfoQuery = `UPDATE SubleteeInfos 
                                      SET ${firstName ? `Firstname='${firstName}',` : ''} ${lastName ? `Lastname='${lastName}',` : ''} ${contactInfo ? `ContactDescription='${contactInfo}',` : ''} 
                                      Email='${email}' 
                                      WHERE Email='${email}'`

        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Attempting edit contact info");

            let editContactInfoResult = await connection.execute(updateContactInfoQuery);

            successful = editContactInfoResult.rowsAffected > 0;

            if (successful) {
                console.log(`Edit of contact info successful`);
            } else {
                console.log(`Something went wrong, contact info not edited`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, contact info not created`);
            console.log(err);
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

    static async getHistoryItems({email}) {
        let connection;
        let reason;
        let successful = false;
        let historyItems = [];
        let historyQuery = `SELECT P.PostId, P.Price, P.StartDate, P.EndDate, P.AdditionalInfo, P.Residence, P.RoomNumber, P.UnitType,
                                   H.CreatedDate , I.Email, I.FirstName, I.LastName
                        FROM CompletePosts P, HistoryItems H, SubleteeInfos I
                        WHERE H.PostId = P.PostId AND H.Email = I.Email AND P.SubletterEmail='${email}'`
        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Attempting to get History Items");

            let historyResult = await connection.execute(historyQuery);

            successful = historyResult.rows.length > 0;

            if (successful) {

                historyItems = historyResult.rows.map(item => {
                    return {
                        postId: item[0],
                        price: item[1],
                        startDate: item[2],
                        endDate: item[3],
                        additionalInfo: item[4],
                        residence: item[5],
                        roomNumber: item[6],
                        createdDate: item[7],
                        subletee: {
                            email: item[8],
                            firstName: item[9],
                            lastName: item[10],
                        }
                    }
                });


                console.log(`Returned History Items of user ${email}`);
            } else {
                console.log(`Something went wrong, History Items not found`);
                reason = "NOT_FOUND";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, History Items not found`);
            console.log(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {successful, reason, historyItems};
    }


}

module.exports = UsersManager;
