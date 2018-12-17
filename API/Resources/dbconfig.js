module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ora_k3n0b",
    password: process.env.NODE_ORACLEDB_PASSWORD || "a20318151",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "dbhost.ugrad.cs.ubc.ca:1522/ug",
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};