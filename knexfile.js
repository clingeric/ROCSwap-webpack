// Update with your config settings.

module.exports = {
  development: {
      client: 'pg',
      connection: {
          host : '127.0.0.1',
          user : 'postgres',
          password : ' ',
          database : 'rocswap',
      }
  },
  staging: {
      client: "postgresql",
      connection: {
          database: "my_db",
          user: "username",
          password: "password"
      },
  pool: {
      min: 2,
      max: 10
  },
  migrations: {
      tableName: "knex_migrations"
      }
  },

production: {
  client: "mariasql",
  connection: {
      host: "127.0.0.1",
      ser: "root",
      db: "rocswap",
      password: "fishingPantsPurple1!",
      charset: "utf8"
  },
  pool: {
      min: 2,
      max: 10
  },
  migrations: {
      tableName: "knex_migrations"
      }
  }
};
