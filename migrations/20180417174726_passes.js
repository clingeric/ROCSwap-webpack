
exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('passes', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        table.decimal('price');
        table.date('availableFrom');
        table.date('availableTo');
      }),
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('tickets'),
    ]);
  };