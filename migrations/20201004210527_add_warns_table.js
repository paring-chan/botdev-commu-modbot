const Knex = require("knex");

/**
 * @param {Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('warns', t => {
      t.text('user').notNullable()
      t.string('reason').defaultTo('사유 없음').notNullable()
      t.uuid('id').notNullable()
  })
};

/**
 * @param {Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('warns')
};
