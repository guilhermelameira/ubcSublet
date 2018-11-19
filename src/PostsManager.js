const oracledb = require('oracledb');
oracledb.autoCommit = true;
//oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

const POST_STATUS = {
    OPEN:"Open",
    CLOSED:"Closed"
};

const DATE_FORMAT = 'MON DD YYYY';

class PostsManager {

    static async createPost({email, price, startDate, endDate, additionalInfo, existingRoom, newRoom }) {
        if (existingRoom){
            return PostsManager.createPostWithExistingRoom({ price, startDate, endDate, additionalInfo, room: existingRoom, subletterEmail: email })
        } else {
            return PostsManager.createPostWithNewRoom({price, startDate, endDate, additionalInfo, roomInfo: newRoom, subletterEmail: email}));
        }
    }

    static async createPostWithExistingRoom({ price, startDate, endDate, additionalInfo, room, subletterEmail }) {
        let connection;
        let reason;
        let successful = false;

        let postId = PostsManager.createUUID();

        let formattedStartDate = PostsManager.formatDate(startDate);
        let formattedEndDate = PostsManager.formatDate(endDate);

        let {roomNumber, building, residence} = room;

        let insertPostQuery = `INSERT INTO SubletPosts (PostId, Price, StartDate, EndDate, AdditionalInfo, Status, Building, Residence, RoomNumber, SubletterEmail)
                                 VALUES (
                                    ${postId},
                                    ${price},
                                    TO_DATE('${formattedStartDate}','${DATE_FORMAT}'),
                                    TO_DATE('${formattedEndDate}','${DATE_FORMAT}'),
                                    '${additionalInfo}',
                                    '${POST_STATUS.OPEN}',
                                    '${building}',
                                    '${residence}',
                                    ${roomNumber},
                                    '${subletterEmail}'
                                 )`

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let insertPostResult = await connection.execute(insertPostQuery);

            successful = insertPostResult.rowsAffected > 0;
            if (successful) {
                successful = true;
                console.log(`Post ${postId} was created`);
            } else {
                console.log(`Something went wrong, room not created`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err;
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

        return {successful, reason, postId}

    }

    static async createPostWithNewRoom({ roomInfo, ...args }) {
        let {successful, reason, room} = await PostsManager.createRoom(roomInfo);
        if (successful){
            return PostsManager.createPostWithExistingRoom({ room, ...args});
        } else {
            return {successful, reason};
        }
    }

    static async createRoom({ roomNumber, building, residence, floor, genderRestriction, unitType }) {
        let connection;
        let reason;
        let successful = false;

        let insertRoomQuery = `INSERT INTO Rooms (RoomNumber, Building, Residence, Floor, GenderRestriction, UnitType)
                                 VALUES (${roomNumber}, '${building}', '${residence}',${floor}, '${genderRestriction}', '${unitType}')`

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let insertRoomResult = await connection.execute(insertRoomQuery);

            successful = insertRoomResult.rowsAffected > 0;
            if (successful) {
                successful = true;
                console.log(`Room ${roomNumber} was created`);
            } else {
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err;
            console.log(`Something went wrong, room not created`);
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

        return {successful, reason, room : {roomNumber, building, residence}};
    }

    static async editPost({postId, price, startDate, endDate, additionalInfo}) {
        let connection;
        let reason;
        let successful = false;

        let editPostQuery = `UPDATE SubletPosts 
                             SET 
                                 ${price ? `Price = ${price},` : ''}
                                 ${startDate ? `StartDate= TO_DATE('${PostsManager.formatDate(startDate)}','${DATE_FORMAT}'),` : ''}
                                 ${endDate ? `EndDate = TO_DATE('${PostsManager.formatDate(endDate)}','${DATE_FORMAT}'),` : ''}
                                 ${additionalInfo ? `AdditionalInfo = '${additionalInfo}',` : ''}
                                 PostId = ${postId}
                             WHERE PostId = ${postId}`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let deletePostResult = await connection.execute(editPostQuery);

            successful = deletePostResult.rowsAffected > 0;
            if (successful) {
                successful = true;
                console.log(`Post ${postId} was edited`);
            } else {
                console.log(`Something went wrong, post not deleted`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err;
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

    static async deletePost({postId}) {
        let connection;
        let reason;
        let successful = false;

        let deletePostQuery = `DELETE FROM SubletPosts 
                               WHERE PostId = ${postId}`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let deletePostResult = await connection.execute(deletePostQuery);

            successful = deletePostResult.rowsAffected > 0;
            if (successful) {
                successful = true;
                console.log(`Post ${postId} was deleted`);
            } else {
                console.log(`Something went wrong, post not deleted`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err;
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

    static async getPost({postId}) {
        let connection;
        let reason;
        let successful = false;
        let post;

        let getPostQuery = `SELECT * FROM SubletPosts 
                               WHERE PostId = ${postId}`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let getPostResult = await connection.execute(getPostQuery);

            successful = getPostResult.rows.length  == 1;
            if (successful) {
                successful = true;
                let postArray = getPostResult.rows[0];
                post = {
                    postId: postArray[0],
                    price: postArray[1],
                    startDate: new Date(postArray[2]),
                    endDate: new Date(postArray[3]),
                    additionalInfo: postArray[4],
                    status: postArray[5],
                    building: postArray[6],
                    residence: postArray[7],
                    roomNumber: postArray[8],
                    subletterEmail: postArray[9]
                }
                console.log(`Post ${postId} was deleted`);
            } else {
                console.log(`Something went wrong, post not deleted`);
                reason = "NO_ROWS_AFFECTED";
            }
        } catch (err) {
            successful = false;
            reason = err;
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

        return {successful, reason, post};
    }

    static async getFilteredPosts({filters, orderBy}) {
        let connection;
        let reason;
        let successful = false;
        let posts;


        let {price, startDate, endDate, status, building, residence, floor, genderRestriction, unitType} = filters;


        let getPostQuery = `SELECT * FROM CompletePosts 
                               WHERE ${price ? `Price <= ${price} AND` : ""}
                                     ${startDate ? `StartDate >= TO_DATE('${PostsManager.formatDate(startDate)}','${DATE_FORMAT}') AND` : ""}
                                     ${endDate ? `StartDate <= TO_DATE('${PostsManager.formatDate(endDate)}','${DATE_FORMAT}') AND` : ""}
                                     ${status ? `Status = '${status}' AND` : ""}
                                     ${building ? `Building = '${building}' AND` : ""}
                                     ${residence ? `Residence = '${residence}' AND` : ""}
                                     ${floor ? `Floor = '${floor}' AND` : ""}
                                     ${genderRestriction ? `GenderRestriction = '${genderRestriction}' AND` : ""}
                                     ${unitType ? `UnitType = '${unitType}' AND` : ""}
                                     StartDate >= TO_DATE('${PostsManager.formatDate(new Date())}','${DATE_FORMAT}')`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let getPostResult = await connection.execute(getPostQuery);

            successful = getPostResult.rows.length  > 0;
            if (successful) {
                successful = true;
                posts = getPostResult.rows.map(PostsManager.arrayToPost);
                console.log(`${posts.length} posts were found`);
            } else {
                reason = "EMPTY_RESULT";
            }
        } catch (err) {
            successful = false;
            reason = err;
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

        return {successful, reason, posts};
    }

    static arrayToPost(array) {
        return {
            price: array[1],
            startDate: new Date(array[2]),
            endDate: new Date(array[3]),
            additionalInfo: array[4],
            status: array[5],
            building: array[6],
            residence: array[7],
            roomNumber: array[8],
        };
    }

    static createUUID() {
        const MIN = 1111111111;
        const MAX = 9999999999;
        return Math.floor(Math.random() * (MAX - MIN)) + MIN;
    }

    static formatDate(date) {
        return (new Date(date)).toDateString().substring(4);
    }
}

module.exports = PostsManager;
