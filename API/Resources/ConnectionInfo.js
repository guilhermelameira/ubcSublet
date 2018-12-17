const dbConfig = require('./dbconfig.js');

const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

module.exports = connectionInfo;