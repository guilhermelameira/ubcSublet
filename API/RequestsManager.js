const oracledb = require('oracledb');
const connectionInfo = require('./Resources/ConnectionInfo');
oracledb.autoCommit = true;

class RequestsManager {

    static async acceptSubletRequest({email, postId, subleteeEmail}) {
        let connection;
        let reason;
        let successful = false;
        let subletRequestMessage;
        let subletRequestFirstName;
        let subletRequestLastName;
        let subletRequestContactInfo;
        let subletRequestEmail = subleteeEmail;

        let date = new Date();
        date = date.toUTCString().split(' ').slice(1, 4).join(' ');

        let acceptSubletRequestQuery = `UPDATE SubletRequests
                                        SET Status='Accepted'      
                                        WHERE '${email}' IN (SELECT SubletterEmail 
                                                             FROM SubletPosts
                                                             WHERE SubletterEmail='${email}' AND PostId=${postId}) 
                                               AND PostId=${postId} AND Email='${subleteeEmail}'`

        let updatePostStatusQuery = `UPDATE SubletPosts
                                       SET Status='Closed'      
                                       WHERE PostId=${postId} AND SubletterEmail='${email}'`


        let createHistoryItemQuery = `INSERT INTO HistoryItems (Email, PostId, CreatedDate)
                                       VALUES ('${subleteeEmail}', ${postId}, TO_TIMESTAMP ('${date}', 'DD Mon YYYY'))`


        let matchedMessageQuery = `SELECT Message 
                                   FROM SubletRequests 
                                   WHERE PostId=${postId} AND Email='${subleteeEmail}'`

        let matchedFirstNameQuery = `SELECT Firstname
                                     FROM SubleteeInfos SI, SubletRequests SR
                                     WHERE SI.Email='${subleteeEmail}' AND SR.Email='${subleteeEmail}'`

        let matchedLastNameQuery = `SELECT Lastname
                                    FROM SubleteeInfos SI, SubletRequests SR
                                    WHERE SI.Email='${subleteeEmail}' AND SR.Email='${subleteeEmail}'`

        let matchedContactInfoQuery = `SELECT ContactDescription
                                       FROM SubleteeInfos SI, SubletRequests SR
                                       WHERE SI.Email='${subleteeEmail}' AND SR.Email='${subleteeEmail}'`


        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Accepting sublet request");

            let acceptSubletRequestResult = await connection.execute(acceptSubletRequestQuery);

            let updatePostStatusResult = await connection.execute(updatePostStatusQuery);

            let createHistoryItemResult = await connection.execute(createHistoryItemQuery);

            let matchedMessageResult = await connection.execute(matchedMessageQuery);

            let matchedFirstNameResult = await connection.execute(matchedFirstNameQuery);

            let matchedLastNameResult = await connection.execute(matchedLastNameQuery);

            let matchedContactInfoResult = await connection.execute(matchedContactInfoQuery);


            successful = acceptSubletRequestResult.rowsAffected > 0 && updatePostStatusResult.rowsAffected > 0 &&
                createHistoryItemResult.rowsAffected > 0;

            if (successful) {

                let messageArray = matchedMessageResult.rows[0];
                subletRequestMessage = messageArray[0];

                let firstNameArray = matchedFirstNameResult.rows[0];
                subletRequestFirstName = firstNameArray[0];

                let lastNameArray = matchedLastNameResult.rows[0];
                subletRequestLastName = lastNameArray[0];

                let contactInfoArray = matchedContactInfoResult.rows[0];
                subletRequestContactInfo = contactInfoArray[0];


                console.log(`sublet request accepted successfully`);

            } else {
                console.log(`Something went wrong, sublet request not accepted`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = "NO_MATCHING_RESULT"
            console.log(`Something went wrong, sublet request not accepted`);
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


        return {
            successful,
            reason,
            subletRequestMessage,
            subletRequestFirstName,
            subletRequestLastName,
            subletRequestContactInfo,
            subletRequestEmail
        };
    }

    static async createSubletRequest({email, postId, message}) {
        let connection;
        let reason;
        let successful = false;


        let createSubletRequestQuery = `INSERT INTO SubletRequests (Email, PostId, Status ${message ? ', Message' : ''})
                                        VALUES ('${email}', ${postId}, 'Pending' ${message ? `, '${message}'` : ''})`


        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Creating sublet request");

            let createSubletRequestResult = await connection.execute(createSubletRequestQuery);

            successful = createSubletRequestResult.rowsAffected > 0;

            if (successful) {
                console.log(`sublet request created successfully`);
            } else {
                console.log(`Something went wrong, sublet request not created`);
                console.log(createSubletRequestQuery);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = "REQUEST_ALREADY_CREATED"
            console.log(`Something went wrong, sublet request not created`);
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

    static async getSubletRequests({email}) {
        let connection;
        let reason;
        let successful = false;
        let posts = [];
        let requests = [];

        let matchedPostQuery = `SELECT*
                                  FROM SubletPosts SP
                                  WHERE SP.SubletterEmail='${email}' AND SP.Status='Open'`

        let matchedSubletRequestQuery = `SELECT*
                                          FROM SubletPosts SP, SubletRequests SR
                                          WHERE SP.SubletterEmail='${email}' AND SR.Status='Pending' AND SP.PostId=SR.PostId AND SP.Status='Open'`


        try {
            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Accepting sublet request");

            let matchedPostResult = await connection.execute(matchedPostQuery);

            let matchedSubletRequestResult = await connection.execute(matchedSubletRequestQuery);


            successful = matchedPostResult.rows.length > 0;

            if (successful) {

                posts = matchedPostResult.rows.map((row) => {
                    return {
                        postId: row[0],
                        price: row[1],
                        startDate: row[2],
                        endDate: row[3],
                        additionalInfo: row[4],
                        status: row[5],
                        building: row[6],
                        residence: row[7],
                        roomNumber: row[8],
                        subletterEmail: row[9]
                    };
                });

                requests = matchedSubletRequestResult.rows.map((row) => {
                    return {
                        email: row[10],
                        postId: row[0]
                    };
                });


                console.log(`sublet request accepted successfully`);

            } else {
                console.log(`Something went wrong, sublet request not found`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = "NO_MATCHING_RESULT"
            console.log(`Something went wrong, sublet request not found`);
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

        return {successful, reason, posts, requests}

    }

}

module.exports = RequestsManager;
