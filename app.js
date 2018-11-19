let UBCSubletAPI = require("./src/UBCSubletAPI.js");
const Configurator = require("./src/Configurator.js");
let express = require('express');
let server = express();

server.use(express.json());
server.use(express.urlencoded({extended: false}));


server.post('/login', function (req, res) {
    UBCSubletAPI.logIn(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/signUp', function (req, res) {
    UBCSubletAPI.signUp(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/createPost', function (req, res) {
    UBCSubletAPI.createPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/getCreatePostInfo', function (req, res) {
    UBCSubletAPI.getCreatePostInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/getPost', function (req, res) {
    UBCSubletAPI.getPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/editPost', function (req, res) {
    UBCSubletAPI.editPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/deletePost', function (req, res) {
    UBCSubletAPI.deletePost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/acceptSubletRequest', function (req, res) {
    UBCSubletAPI.acceptSubletRequest(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/createSubleteeInfo', function (req, res) {
    UBCSubletAPI.createSubleteeInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/editSubleteeInfo', function (req, res) {
    UBCSubletAPI.editSubleteeInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/createSubletRequest', function (req, res) {
    UBCSubletAPI.createSubletRequest(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/getFilteredPosts', function (req, res) {
    UBCSubletAPI.getFilteredPosts(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/getHistory', function (req, res) {
    UBCSubletAPI.getHistory(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/getFilterCount', function (req, res) {
    UBCSubletAPI.getFilterCount(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

server.post('/resetDB', function (req, res) {
    Configurator.resetDB(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

// TODO: There might be missing endpoints, add if necessary;



module.exports = server;
