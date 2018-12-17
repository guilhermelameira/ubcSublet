const oracledb = require('oracledb');
const connectionInfo = require('./Resources/ConnectionInfo');
oracledb.autoCommit = true;

const POST_STATUS = {
    OPEN: "Open",
    CLOSED: "Closed"
};

const DATE_FORMAT = 'MON DD YYYY';

class PostsManager {

    static async createPost({email, price, startDate, endDate, additionalInfo, room}) {
        let roomExists = await PostsManager.doesRoomExist(room);
        if (roomExists) {
            return PostsManager.createPostWithExistingRoom({
                price,
                startDate,
                endDate,
                additionalInfo,
                room,
                subletterEmail: email
            })
        } else {
            return PostsManager.createPostWithNewRoom({
                price,
                startDate,
                endDate,
                additionalInfo,
                roomInfo: room,
                subletterEmail: email
            });
        }
    }

    static async doesRoomExist({roomNumber, building, residence}) {
        let connection;
        let roomExists;

        let getRoomQuery = `SELECT * FROM Rooms 
                               WHERE RoomNumber = ${roomNumber} 
                               AND Building = '${building}' 
                               AND Residence = '${residence}'`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let getRoomResult = await connection.execute(getRoomQuery);

            roomExists = getRoomResult.rows.length > 0;
        } catch (err) {
            roomExists = false;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return roomExists;
    };

    static async createPostWithExistingRoom({price, startDate, endDate, additionalInfo, room, subletterEmail}) {
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

    static async createPostWithNewRoom({roomInfo, ...args}) {
        let {successful, reason, room} = await PostsManager.createRoom(roomInfo);
        if (successful) {
            return PostsManager.createPostWithExistingRoom({room, ...args});
        } else {
            return {successful, reason};
        }
    }

    static async createRoom({roomNumber, building, residence, floor, genderRestriction, unitType}) {
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

        return {successful, reason, room: {roomNumber, building, residence}};
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

            successful = getPostResult.rows.length == 1;
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
                                     Status = 'Open'
                               ${orderBy.length == 0 ? "" : `ORDER BY ${orderBy.join(', ').toUpperCase()}`}`;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let getPostResult = await connection.execute(getPostQuery);
            successful = true;
            posts = getPostResult.rows.map(PostsManager.arrayToCompletePost);
            console.log(`${posts.length} posts were found`);

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

    static async getFilterCount() {
        let connection;
        let reason;
        let successful = false;


        let residence = [];
        let unitType = [];
        let kitchens = [];
        let bathrooms = [];
        let residents = [];

        let countResQuery =
            `SELECT Residence, COUNT(Residence)
          FROM CompletePosts
          WHERE Status='Open'
          GROUP BY Residence`


        let countUnittypeQuery =
            `SELECT UnitType, COUNT(UnitType)
          FROM CompletePosts
          WHERE Status='Open'
          GROUP BY UnitType`

        let countKitchenQuery =
            `SELECT Kitchens, COUNT(Kitchens)
          FROM CompletePosts
          WHERE Status='Open'
          GROUP BY Kitchens`

        let countBathroomQuery =
            `SELECT Bathrooms, COUNT(Bathrooms)
          FROM CompletePosts
          WHERE Status='Open'
          GROUP BY Bathrooms`


        let countResidentsQuery =
            `SELECT Residents, COUNT(Residents)
          FROM CompletePosts
          WHERE Status='Open'
          GROUP BY Residents`

        try {

            connection = await oracledb.getConnection(connectionInfo);
            console.log("Connection successful. Attempting to get count");

            let countResResult = await connection.execute(countResQuery);
            let countUnitResult = await connection.execute(countUnittypeQuery);
            let countKitchenResult = await connection.execute(countKitchenQuery);
            let countBathResult = await connection.execute(countBathroomQuery);
            let countResidentsResult = await connection.execute(countResidentsQuery);


            successful = countResResult.rows.length > 0;

            if (successful) {

                residence = countResResult.rows.map((row) => {
                    return {
                        value: row[0],
                        count: row[1]
                    };
                });


                unitType = countUnitResult.rows.map((row) => {
                    return {
                        value: row[0],
                        count: row[1]
                    };
                });


                kitchens = countKitchenResult.rows.map((row) => {
                    return {
                        value: row[0],
                        count: row[1]
                    };
                });


                bathrooms = countBathResult.rows.map((row) => {
                    return {
                        value: row[0],
                        count: row[1]
                    };
                });


                residents = countResidentsResult.rows.map((row) => {
                    return {
                        value: row[0],
                        count: row[1]
                    };
                });


                console.log(`count successful`);

            }


            else {
                console.log(`Something went wrong, count not found`);
                reason = "NO_OUTPUT";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, count not found`);
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

        return {successful, reason, filters: {residence, unitType, kitchens, bathrooms, residents}};
    }

    static async getCreatePostInfo() {
        let connection;
        let reason;
        let successful = false;
        let residences = [];
        let unitTypes = [];


        let residencesQuery = `SELECT ResidenceName
                            FROM Residences`;

        let unitTypesQuery = `SELECT UnitTypeName
                           FROM UnitTypes`;


        try {
            connection = await oracledb.getConnection(connectionInfo);

            let residencesResult = await connection.execute(residencesQuery);
            let unitTypesResult = await connection.execute(unitTypesQuery);

            successful = (residencesResult.rows.length > 0) && unitTypesResult.rows.length > 0;

            if (successful) {

                residences = residencesResult.rows.map(row => row[0]);
                unitTypes = unitTypesResult.rows.map(row => row[0]);

                console.log(`Got create post info`);
            } else {
                console.log(`Something went wrong, Info not found`);
                reason = "NOT_FOUND";
            }
        } catch (err) {
            successful = false;
            reason = err.message;
            console.log(`Something went wrong, Info not found`);
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

        return {successful, reason, info: {residences, unitTypes}};
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

    static arrayToCompletePost(array) {
        return {
            postId:array[0],
            price: array[1],
            startDate: new Date(array[2]),
            endDate: new Date(array[3]),
            additionalInfo: array[4],
            status: array[5],
            building: array[6],
            residence: array[7],
            roomNumber: array[8],
            subletterEmail: array[9],
            floor: array[10],
            genderRestriction: array[11],
            unitType: array[12],
            residenceInfoLink: array[13],
            residencePictureLink: array[14],
            kitchens: array[15],
            bathrooms: array[16],
            residents: array[17],
            unitTypeLink: array[18],
            unitTypeInfoLink: array[19],
            yearRoundPrice: array[20]
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
