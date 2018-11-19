const oracledb = require('oracledb');
oracledb.autoCommit = true;

const dbConfig = require('../dbconfig.js');
const connectionInfo = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};
const fs = require('fs');

class Configurator {
    static async resetDB() {
        const createTablesSql = fs.readFileSync('./CreateTables.sql').toString();
        let queries = createTablesSql.split('\n').filter(s => !s.trim().startsWith('--')).join(' ')
            .split('\t').join('').split(';')
            .map(s => s.trim()).filter(s => s.length > 0);
        let connection;
        let response = [];
        let code;

        try {
            connection = await oracledb.getConnection(connectionInfo);

            let executeQuery = (async (query) => {
                try {
                    let queryResult = await connection.execute(query);

                    console.log(`Query: ${query}`);
                    console.log('WAS SUCCESSFUL');
                    console.log(queryResult);
                    console.log('\n');

                    return {
                        query,
                        successful: true,
                        response: queryResult
                    }
                } catch (err) {
                    console.log(`Query: ${query}`);
                    console.log('FAILED')
                    console.error(err);
                    console.log('\n');

                    return {
                        query,
                        successful: false,
                        response: err
                    }
                }

            });

            while(queries.length > 0){
                let query = queries.shift();
                let result = await executeQuery(query);
                response.push(result);
            }

            code = 200;

        } catch (err) {
            console.log(err)
            code = 404;
            response = err.toString();
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return {response, code};
    }

}

module.exports = Configurator;