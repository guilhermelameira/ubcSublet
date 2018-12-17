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

        let {successful, reason} = await UsersManager.addContactInfo({
            email: auth.email,
            firstName,
            lastName,
            contactInfo
        });
        let code = successful ? 200 : 400;
        let response = reason ? {reason} : null;

        return {response, code};
    }

    static async getSubleteeInfo({auth}) {
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason, firstName, lastName, contactDescription} = await UsersManager.getSubleteeInfo({email});
        let code = successful ? 200 : 400;
        let response = successful ? {email, firstName, lastName, contactDescription} : reason;

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

    static async getCreatePostInfo() {
        let {successful, reason, info} = await PostsManager.getCreatePostInfo()

        let code = successful ? 200 : 404;
        let response = successful ? info : {reason};

        return {response, code};
    }

    static async createPost({auth, price, startDate, endDate, additionalInfo, room}) {
        // check authentication
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        //check required fields
        if (!(price && startDate && endDate && room)) {
            return {response: {reason: "MISSING_FIELDS"}, code: 404};
        }

        let {successful, reason, postId} = await PostsManager.createPost({
            email: auth.email,
            price,
            startDate,
            endDate,
            additionalInfo,
            room
        })

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

    static async getSubletRequests({auth}) {
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason, posts, requests} = await RequestsManager.getSubletRequests({email});
        let code = successful ? 200 : 400;
        let response = successful ? {posts, requests} : {reason};


        return {response, code};
    }

    static async acceptSubletRequest({auth, postId, subleteeEmail}) {

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {
            successful, reason, subletRequestMessage, subletRequestFirstName,
            subletRequestLastName, subletRequestContactInfo, subletRequestEmail
        } = await RequestsManager.acceptSubletRequest({email, postId, subleteeEmail});
        let code = successful ? 200 : 400;
        let response = successful ? {
            subletRequestMessage, subletRequestFirstName,
            subletRequestLastName, subletRequestContactInfo, subletRequestEmail
        } : {reason};


        return {response, code};
    }

    static async createSubletRequest({auth, postId, message}) {
        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason} = await RequestsManager.createSubletRequest({email, postId, message});
        let code = successful ? 200 : 400;
        let response = reason ? {reason} : null;


        return {response, code};
    }


    static async getHistory({auth}) {

        if (!(auth && await UsersManager.isAuthorized(auth))) {
            return {code: 401};
        }

        let email = auth.email;

        let {successful, reason, historyItems} = await UsersManager.getHistoryItems({email})

        let code = successful ? 200 : 404;
        let response = successful ? {historyItems} : {reason};

        return {response, code};

    }

    static async getFilterCount() {
        let responseCode = 200;

        let {successful, reason, filters} = await PostsManager.getFilterCount();

        let code = successful ? 200 : 404;
        let response = successful ? filters : {reason};

        return {response, code};
    }

}

module.exports = UBCSubletAPI;
