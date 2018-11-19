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

    static async signUp({email, password}) {
        //check required fields
        if (!(email && password)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason} = await UsersManager.signUp({email, password});
        let code = successful ? 200 : 404;
        let response = reason ? {reason} : null;

        return {response, code};
    }

    static async logIn({email, password}) {
        //check required fields
        if (!(email && password)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason} = await UsersManager.logIn({email, password});
        let code = successful ? 200 : 404;
        let response = reason ? {reason} : null;

        return {response, code};
    }

    static async createSubleteeInfo({auth, firstName, lastName, contactInfo}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        //check required fields
        if (!(firstName && lastName && contactInfo)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason} = await UsersManager.addContactInfo({email: auth.email, firstName, lastName, contactInfo});
        let code = successful ? 200 : 400;
        let response = reason ? {reason} : null;

        return {response, code};
    }

    static async editSubleteeInfo({auth, ...args}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let {successful, reason} = await UsersManager.editContactInfo({email: auth.email, ...args})

        let code = successful ? 200 : 404;
        let response = reason ? {reason} : null;

        return {response, code};
    }

    static async getCreatePostInfo({auth}) {
        let responseCode = 200;
        let rooms;
        let residences;
        let unitTypes;

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        // TODO: Implement this


        return {response: {rooms, residences, unitTypes}, code: responseCode};
    }

    static async createPost({ auth, price, startDate, endDate, additionalInfo, existingRoom, newRoom }) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        //check required fields
        if (!(price && startDate && endDate && (existingRoom || newRoom))) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason, postId} = await PostsManager.createPost({ email:auth.email, price, startDate, endDate, additionalInfo, existingRoom, newRoom })

        let code = successful ? 200 : 404;
        let response = successful ? {postId} : {reason};

        return {response, code};
    }

    static async editPost({auth, ...args}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let {successful, reason} = await PostsManager.editPost({email: auth.email, ...args});

        let code = successful ? 200 : 404;
        let response = successful ? null : {reason};

        return {response, code};
    }

    static async deletePost({auth, postId}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        //check required fields
        if (!(postId)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason} = await PostsManager.deletePost({email: auth.email, postId});

        let code = successful ? 200 : 404;
        let response = successful ? null : {reason};

        return {response, code};
    }

    static async getPost({auth, postId}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        //check required fields
        if (!(postId)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason, post} = await PostsManager.getPost({email: auth.email, postId});

        let code = successful ? 200 : 404;
        let response = successful ? post : {reason};

        return {response, code};
    }

    static async getFilteredPosts({filters, orderBy}) {
        //check required fields
        if (!(filters || orderBy)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason, posts} = await PostsManager.getFilteredPosts({filters, orderBy});

        let code = successful ? 200 : 404;
        let response = successful ? posts : {reason};

        return {response, code};
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
