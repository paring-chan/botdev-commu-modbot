const Knex = require("knex");

/**
 * @param {Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('chulchecks', t => {
      t.text('user').notNullable()
      t.text('at').notNullable()
  })
};

/**
 * @param {Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('chulchecks')
};
