class API {

    static echo(data) {
        return data;
    }

    static singUp({email, password}) {
        // TODO: Do the sign up

          let sqlQuery = `INSERT INTO User (Email, Password)
                          VALUES ("${email}","${password}");`
        return {sqlQuery};
    }

    static logIn({email, password}) {
        // TODO: Do the logIn

        let sqlQuery = `SELECT Email, Password
                        FROM User;
                        WHERE Email="${email}" AND Password="${password}"`

        return {sqlQuery};
    }

}

module.exports = API;
