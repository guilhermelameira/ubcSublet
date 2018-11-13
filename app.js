//import API from "./src/ubcSubletFacade.js";

let express = require('express');
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.post('/echo', function (req, res) {
 return res.send(req.body);
});


module.exports = app;
