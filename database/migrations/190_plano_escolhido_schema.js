'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlanoEscolhidoSchema extends Schema {
  up () {
    this.create('plano_escolhidos', (table) => {
      table.increments('id')
      table.integer('id_plano_parceiro').unsigned()
      .references('id')
      .inTable('planos')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      table.integer('id_parceiro').unsigned()
      .references('id')
      .inTable('parceiros')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      table.integer('id_banco_cde').unsigned()
      .references('id')
      .inTable('dados_bancarios_boletos')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      table.integer('id_colaborador_vendedor').unsigned()
      .references('id')
      .inTable('colaboradores')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      table.integer('id_colaborador_digitador').unsigned()
      .references('id')
      .inTable('colaboradores')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

      table.integer('id_forma_pagamento').unsigned()
      .references('id')
      .inTable('forma_pagamentos')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');


      table.date('data_emissao').notNullable()
      table.date('data_final').notNullable()
      table.boolean('plano_ativo').notNullable()
      table.string('razao_nome', 100).notNullable()
      table.date('data_vencimento').notNullable()
      table.decimal('valor_plano', 10, 2).notNullable()
      table.decimal('multa_percentual', 6, 2).notNullable()
      table.decimal('multa_valor', 9, 2).notNullable()
      table.decimal('juros_valor', 9, 2).notNullable()
      table.decimal('juros_percentual', 9, 2).notNullable()
      table.decimal('valor_pago', 10, 2).notNullable()
      table.date('data_pagamento').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('plano_escolhidos')
  }
}

module.exports = PlanoEscolhidoSchema
