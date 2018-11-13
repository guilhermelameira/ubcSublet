let API = require("./src/API.js");
let express = require('express');
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.post('/echo', function (req, res) {
    return res.send(API.echo(req.body));
});

app.post('/login', function (req, res) {
    return res.send(API.logIn(req.body));
});

app.post('/signUp', function (req, res) {
    return res.send(API.singUp(req.body));
});


module.exports = app;
