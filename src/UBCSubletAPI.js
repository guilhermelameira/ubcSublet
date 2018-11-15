const oracledb = require('oracledb');
oracledb.autoCommit = true;
oracledb.queueTimeout = 3000; // 3 seconds

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

const UsersManager = require('./UsersManager.js');
const PostsManager = require('./PostsManager.js');
const RequestsManager = require('./RequestsManager.js');


class UBCSubletAPI {

    // Already implemented, use it as a guide
    static async signUp({email, password}) {
        let {successful, reason} = await UsersManager.signUp({email, password});
        let code = successful? 200 : 404;
        let response = reason? {reason} : null;

        return {response, code};
    }

    // Already implemented, use it as a guide
    static async logIn({email, password}) {
        let {successful, reason} = await UsersManager.logIn({email, password});
        let code = successful? 200 : 404;
        let response = reason? {reason} : null;

        return {response, code};
    }

    static async createSubleteeInfo({auth, firstName, lastName, contactInfo}) {
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason} = await UsersManager.addContactInfo({email, firstName, lastName, contactInfo});
        let code = successful? 200 : 400;
        let response = reason? {reason} : null;

        return {response, code};
    }

    static async editSubleteeInfo({auth, firstName, lastName, contactInfo}) {
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason} = await UsersManager.editContactInfo({email, firstName, lastName, contactInfo})

        let code = successful? 200 : 404;
        let response = reason? {reason} : null;

        return {response, code};
    }

    // All the logic for the above should be in User Manager
    // We should create other managers to deal with different parts of the application
    // I created PostsManager and RequestsManger, we might need more

    static async getCreatePostInfo({auth}) {
        let responseCode = 200;
        let rooms;
        let residences;
        let unitTypes;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {rooms,residences,unitTypes}, code: responseCode};
    }

    static async createPost({auth, price, startDate, endDate, additionalInfo, existingRoom, newRoom}) {
        let responseCode = 200;
        let postId;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this

        return {response: {postId}, code: responseCode};
    }

    static async editPost({auth, postId /* TODO: other fields */}) {
        let responseCode = 200;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {}, code: responseCode};
    }

    static async deletePost({auth, postId}) {
        let responseCode = 200;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {}, code: responseCode};
    }

    static async getPost({auth, postId}) {
        let responseCode = 200;
        let price;
        let startDate;
        let endDate ;
        let additionalInfo
        let room;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {price,startDate,endDate,additionalInfo,room}, code: responseCode};
    }

    static async getFilteredPosts({filters, orderBy}) {
        let responseCode = 200;
        let posts
        // TODO: Implement this


        return {response: {posts}, code: responseCode};
    }


    static async acceptSubletRequest({auth, postId, subleteeEmail}) {
        let responseCode = 200;
        let message;
        let firstName;
        let lastName;
        let contactInfo;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {message, firstName, lastName, contactInfo}, code: responseCode};
    }

    static async createSubletRequest({auth, postId, message}) {
        let responseCode = 200;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {}, code: responseCode};
    }


    static async getHistory({auth}) {
        let responseCode = 200;
        let historyItems;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {historyItems}, code: responseCode};
    }

    static async getFilterCount() {
        let responseCode = 200;

        // TODO: Implement this


        return {response: {/*TODO*/}, code: responseCode};
    }

}

module.exports = UBCSubletAPI;
