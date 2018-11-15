let UBCSubletAPI = require("./src/UBCSubletAPI.js");
let express = require('express');
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.post('/login', function (req, res) {
    UBCSubletAPI.logIn(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/signUp', function (req, res) {
    UBCSubletAPI.signUp(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/createPost', function (req, res) {
    UBCSubletAPI.createPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/getCreatePostInfo', function (req, res) {
    UBCSubletAPI.getCreatePostInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/getPost', function (req, res) {
    UBCSubletAPI.getPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/editPost', function (req, res) {
    UBCSubletAPI.editPost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/deletePost', function (req, res) {
    UBCSubletAPI.deletePost(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/acceptSubletRequest', function (req, res) {
    UBCSubletAPI.acceptSubletRequest(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/createSubleteeInfo', function (req, res) {
    UBCSubletAPI.createSubleteeInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/editSubleteeInfo', function (req, res) {
    UBCSubletAPI.editSubleteeInfo(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/createSubletRequest', function (req, res) {
    UBCSubletAPI.createSubletRequest(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/getFilteredPosts', function (req, res) {
    UBCSubletAPI.getFilteredPosts(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/getHistory', function (req, res) {
    UBCSubletAPI.getHistory(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.post('/getFilterCount', function (req, res) {
    UBCSubletAPI.getFilterCount(req.body).then(({response, code}) => {
        res.status(code).send(response);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

// TODO: There might be missing endpoints, add if necessary;



module.exports = app;
