const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
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
