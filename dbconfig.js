module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ora_t3x0b",
    password: process.env.NODE_ORACLEDB_PASSWORD || "a10282168",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "dbhost.ugrad.cs.ubc.ca:1522/ug",
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};