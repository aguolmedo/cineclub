var knex = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.HOST_DB,
        user: process.env.USER_MYSQL,
        password: process.env.PASSWORD_MYSQL,
        database: process.env.DB_NAME,
    },
    pool: {
        min: 0,
        max: 10,
    },
});
module.exports = knex;
//# sourceMappingURL=dbconfig.js.map