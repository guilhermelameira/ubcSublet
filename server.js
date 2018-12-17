const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

const UBCSubletAPI = require("./API/UBCSubletAPI.js");
const Configurator = require("./API/Configurator.js");

app.prepare()
    .then(() => {
        const server = express()
        server.use(express.json());

        // Fontend views

        server.get('/', (req, res) => {
            return app.render(req, res, '/logInPage', req.query)
        })

        server.get('/logInPage', (req, res) => {
            return app.render(req, res, '/logInPage', req.query)
        })

        server.get('/mainPage/:email/:password', (req, res) => {
            return app.render(req, res, '/mainPage', {email: req.params.email, password: req.params.password})
        })

        server.get('/browsePostsPage/:email/:password', (req, res) => {
            return app.render(req, res, '/browsePostsPage', {email: req.params.email, password: req.params.password})
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        // Backend API

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

        server.post('/getSubletRequests', function (req, res) {
            UBCSubletAPI.getSubletRequests(req.body).then(({response, code}) => {
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

        server.post('/getSubleteeInfo', function (req, res) {
            UBCSubletAPI.getSubleteeInfo(req.body).then(({response, code}) => {
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

        // Admin functions

        server.post('/resetDB', function (req, res) {
            Configurator.resetDB(req.body).then(({response, code}) => {
                res.status(code).send(response);
            }).catch((err) => {
                res.status(404).send(err);
            });
        });


        server.listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
