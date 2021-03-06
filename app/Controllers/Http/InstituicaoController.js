'use strict'

const Request = require('@adonisjs/framework/src/Request')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with instituicaos
 */
const Database = use('Database')
const Endereco = use('App/Models/Endereco')
const Telefone = use('App/Models/Telefone')
const Plano = use('App/Models/Plano')
const PlanoInstituicao = use('App/Models/PlanoInstituicao')
const Image = use('App/Models/Image')
const User = use('App/Models/User')
const Entidade = use('App/Models/Entidade')
const Instituicao = use('App/Models/Instituicao')
const PlanoEscolhido = use('App/Models/PlanoEscolhido')
const PlanoEscolhidoInstituicao = use('App/Models/PlanoEscolhidoInstituicao')
const FormaPagamento = use('App/Models/FormaPagamento')
const TipoCargoResponsavel = use('App/Models/TipoCargoResponsavel')
const CategoriaInstituicao = use('App/Models/CategoriaInstituicao')
const { validateAll } = use('Validator')
class InstituicaoController {
  /**
   * Show a list of all instituicaos.
   * GET instituicaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const entidades = await Database
        .select('*','instituicaos.id as pk')
        .table('entidades')
        .innerJoin('instituicaos','entidades.id','instituicaos.id_entidade')
        .innerJoin('telefones', 'entidades.id_telefone', 'telefones.id')
        .innerJoin('enderecos','entidades.id_endereco','enderecos.id')
        .innerJoin('users','entidades.id_user','users.id')
      response.send(entidades)
    } catch (err) {
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Render a form to be used for creating a new instituicao.
   * GET instituicaos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new instituicao.
   * POST instituicaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const erroMessage = {
        'email.required': 'Esse campo é obrigatório',
        'email.unique': 'Valor já cadastrado no Sistema',
        'email.email': 'Escreva no formato email@email.com',
        'password.required': 'Esse campo é obrigatório', //USER
        'uf.required': 'Esse campo é obrigatório',
        // 'uf.integer': 'Insira apenas valores numéricos',
        'cidade.required': 'Esse campo é obrigatório',
        'cep.required': 'Esse campo é obrigatório',
        'cep.integer': 'Insira apenas valores numéricos',
        'rua.required': 'Esse campo é obrigatório',
        'numero.required': 'Esse campo é obrigatório',
        'numero.integer': 'Insira apenas valores numéricos',
        'complemento.required': 'Esse campo é obrigatório',
        'bairro.required': 'Esse campo é obrigatório', //ENDERECO
        'fone_fixo_ddd.required': 'Esse campo é obrigatório',
        'fone_fixo_ddd.integer': 'Insira apenas valores numéricos',
        'fone_fixo_numero.required': 'Esse campo é obrigatório',
        'fone_fixo_numero.integer': 'Insira apenas valores numéricos',
        'celular_ddd.required': 'Esse campo é obrigatório',
        'celular_ddd.integer': 'Insira apenas valores numéricos',
        'celular_numero.required': 'Esse campo é obrigatório',
        'celular_numero.integer': 'Insira apenas valores numéricos',//TELEFONE
        'data_primeira_adesao.required': 'Esse campo é obrigatório',
        'max_dependentes.required': 'Esse campo é obrigatório',
        'max_dependentes.integer': 'Insira apenas valores numéricos',
        'responsavel_fone_ddd.required': 'Esse campo é obrigatório',
        'responsavel_fone_ddd.integer': 'Insira apenas valores numéricos',
        'responsavel_fone_numero.required': 'Esse campo é obrigatório',
        'responsavel_fone_numero.integer': 'Insira apenas valores numéricos',
        'CNPJ.required': 'Esse campo é obrigatório',
        'CNPJ.integer': 'Insira apenas valores numéricos',
        'CNPJ.unique': 'Valor já cadastrado no Sistema',
        'descricao_tipo_cargo.required': 'Esse campo é obrigatório',//INSTITUICAO
        'razao_social.required': 'Esse campo é obrigatório',
        'nome_fantasia.required': 'Esse campo é obrigatório',
        'responsavel_nome.required': 'Esse campo é obrigatório',
        'responsavel_cpf.required': 'Esse campo é obrigatório',
        'responsavel_cpf.integer': 'Insira apenas valores numéricos',
        'link_site.required': 'Esse campo é obrigatório',
        'link_facebook.required': 'Esse campo é obrigatório',
        'link_instagram.required': 'Esse campo é obrigatório',
        'Perfil.required': 'Esse campo é obrigatório',
        'data_emissao.required': 'Esse campo é obrigatório',
        'data_final.required': 'Esse campo é obrigatório',
        'data_vencimento.required': 'Esse campo é obrigatório',
      }
      const validation = await validateAll(request.all(), {
        email: 'required |unique:users|email',
        password: 'required', //USER
        uf: 'required',
        cidade: 'required',
        cep: 'required |integer',
        rua: 'required',
        numero: 'required |integer',
        complemento: 'required',
        bairro: 'required', //ENDERECO
        fone_fixo_ddd: 'required |integer',
        fone_fixo_numero: 'required |integer',
        celular_ddd: 'required |integer',
        celular_numero: 'required |integer',//TELEFONE
        data_primeira_adesao: 'required',
        max_dependentes: 'required |integer',
        responsavel_fone_ddd: 'required |integer',
        responsavel_fone_numero: 'required |integer',
        CNPJ: 'required |integer |unique:instituicaos',
        descricao_tipo_cargo: 'required',//INSTITUICAO
        razao_social: 'required',
        nome_fantasia: 'required',
        responsavel_nome: 'required',
        responsavel_cpf: 'required |integer',
        link_site: 'required',
        link_facebook: 'required',
        link_instagram: 'required',
        Perfil: 'required',
        data_emissao: 'required',
        data_final: 'required',
        data_vencimento: 'required',
      }, erroMessage)

      if (validation.fails()) {
        return response.status(400).send({
          message: validation.messages()
        })
      }
      const {
        email,
        password, //USER
        uf,
        cidade,
        cep,
        rua,
        numero,
        complemento,
        bairro, //ENDERECO
        fone_fixo_ddd,
        fone_fixo_numero,
        celular_ddd,
        celular_numero,//TELEFONE
        data_primeira_adesao,
        max_dependentes,
        responsavel_fone_ddd,
        responsavel_fone_numero,
        CNPJ,
        id_categoria_instituicaos,
        descricao_tipo_cargo,//INSTITUICAO
        razao_social,
        nome_fantasia,
        responsavel_nome,
        responsavel_cpf,
        link_site,
        link_facebook,
        link_instagram,
        Perfil,
        id_imagem1,
        id_imagem2,
        id_imagem3,
        id_imagem4,
        id_imagem5,//ENTIDADE
        id_plano_instituicao,
        id_banco_cde,
        id_colaborador_vendedor,
        id_colaborador_digitador,
        data_emissao,
        data_final,
        data_vencimento,
        multa_valor,
        juros_valor,
        valor_pago,
        data_pagamento,
        id_forma_pagamento,
        // descricao_forma_pagamento
      } = request.all()
      console.log(email)
      const user = await User.create({
        email,
        password,
        username: email
      }, trx)
      const endereco = await Endereco.create({
        uf,
        cidade,
        cep,
        rua,
        numero,
        complemento,
        bairro
      }, trx)
      const telefone = await Telefone.create({
        fone_fixo_ddd,
        fone_fixo_numero,
        celular_ddd,
        celular_numero
      }, trx)
      const entidade = await Entidade.create({
        id_endereco: endereco.id,
        id_telefone: telefone.id,
        razao_social,
        nome_fantasia,
        responsavel_nome,
        responsavel_cpf,
        link_site,
        link_facebook,
        link_instagram,
        Perfil,
        id_user: user.id,
        id_imagem1,
        id_imagem2,
        id_imagem3,
        id_imagem4,
        id_imagem5
      }, trx)
      const tipoCargoResponsavel = await TipoCargoResponsavel.create({
        descricao_tipo_cargo
      }, trx)
      const instituicao = await Instituicao.create({
        data_primeira_adesao,
        max_dependentes,
        responsavel_fone_ddd,
        responsavel_fone_numero,
        CNPJ,
        id_categoria_instituicaos,
        id_entidade: entidade.id,
        id_responsavel_cargo: tipoCargoResponsavel.id
      }, trx)
      // const formaPagamento = await FormaPagamento.create({
      //   descricao_forma_pagamento
      // }, trx)
      const planoInstituicao = await PlanoInstituicao.findBy('id',id_plano_instituicao)
      const plano = await Plano.findBy('id',planoInstituicao.id_plano)
      const planoEscolhido = await PlanoEscolhido.create({
        valor_plano:plano.valor_plano,
        id_banco_cde,
        id_colaborador_vendedor,
        id_colaborador_digitador,
        id_forma_pagamento,
        data_emissao,
        data_final,
        data_vencimento,
        multa_valor,
        juros_valor,
        valor_pago,
        data_pagamento,
      }, trx)
      const planoEscolhidoInstituicao = await PlanoEscolhidoInstituicao.create({
        id_plano_instituicao,
        id_instituicao: instituicao.id,
        id_plano_escolhido: planoEscolhido.id
      }, trx)
      await trx.commit()
      return response.status(201).send({ message: 'Instituicao criada com sucesso!' });
    } catch (err) {
      await trx.rollback()
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Display a single instituicao.
   * GET instituicaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const instituicao = await Instituicao.findBy('id', params.id)
      const tipoCargoResponsavel = await TipoCargoResponsavel.findBy('id',instituicao.id_responsavel_cargo)
      const categoriaInstituicao = await CategoriaInstituicao.findBy('id',instituicao.id_categoria_instituicaos)
      const entidade = await Entidade.findBy('id', instituicao.id_entidade)
      const endereco = await Endereco.findBy('id', entidade.id_endereco)
      const telefone = await Telefone.findBy('id', entidade.id_telefone)
      const user = await User.findBy('id', entidade.id_user)
      const fullParceiro = {
        instituicao,
        tipoCargoResponsavel,
        categoriaInstituicao,
        entidade,
        endereco,
        telefone,
        user
      }
      return response.status(200).json(fullParceiro)
    } catch (err) {
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Render a form to update an existing instituicao.
   * GET instituicaos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update instituicao details.
   * PUT or PATCH instituicaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const erroMessage = {
        'email.email': 'Escreva no formato email@email.com',
        'cep.integer': 'Insira apenas valores numéricos',
        'numero.integer': 'Insira apenas valores numéricos',
        'fone_fixo_ddd.integer': 'Insira apenas valores numéricos',
        'fone_fixo_numero.integer': 'Insira apenas valores numéricos',
        'celular_ddd.integer': 'Insira apenas valores numéricos',
        'celular_numero.integer': 'Insira apenas valores numéricos',//TELEFONE
        'max_dependentes.integer': 'Insira apenas valores numéricos',
        'responsavel_fone_ddd.integer': 'Insira apenas valores numéricos',
        'responsavel_fone_numero.integer': 'Insira apenas valores numéricos',
        'CNPJ.integer': 'Insira apenas valores numéricos',
        'responsavel_cpf.integer': 'Insira apenas valores numéricos',
      }
      const validation = await validateAll(request.all(), {
        email: 'email',
        cep: 'integer',
        numero: 'integer',
        fone_fixo_ddd: 'integer',
        fone_fixo_numero: 'integer',
        celular_ddd: 'integer',
        celular_numero: 'integer',//TELEFONE
        max_dependentes: 'integer',
        responsavel_fone_ddd: 'integer',
        responsavel_fone_numero: 'integer',
        CNPJ: 'integer',
        responsavel_cpf: 'integer',
      }, erroMessage)

      if (validation.fails()) {
        return response.status(400).send({
          message: validation.messages()
        })
      }
      const instituicao = await Instituicao.findBy('id', request.params.id)
      const entidade = await Entidade.findBy('id', instituicao.id_entidade)
      const endereco = await Endereco.findBy('id', entidade.id_endereco)
      const telefone = await Telefone.findBy('id', entidade.id_telefone)
      const user = await User.findBy('id', entidade.id_user)

      const entidadeReq = await request.only([
        "razao_social",
        "nome_fantasia",
        "responsavel_nome",
        "responsavel_cpf",
        "link_site",
        "link_facebook",
        "link_instagram",
        "Perfil",
        "id_imagem1",
        "id_imagem2",
        "id_imagem3",
        "id_imagem4",
        "id_imagem5"
      ])
      const instituicaoReq = request.only([
        "data_primeira_adesao",
        "max_dependentes",
        "responsavel_fone_ddd",
        "responsavel_fone_numero",
        "CNPJ"
      ])
      const enderecoReq = request.only([
        "uf",
        "cidade",
        "cep",
        "rua",
        "numero",
        "complemento",
        "bairro"
      ])
      const telefoneReq = request.only([
        "fone_fixo_ddd",
        "fone_fixo_numero",
        "celular_ddd",
        "celular_numero"
      ])
      const userReq = request.only([
        "email",
        "password",
      ])
     
      instituicao.merge({ ...instituicaoReq })
      entidade.merge({ ...entidadeReq })
      telefone.merge({ ...telefoneReq })
      endereco.merge({ ...enderecoReq })
      user.merge({ ...userReq })

      await instituicao.save(trx)
      await entidade.save(trx)
      await telefone.save(trx)
      await endereco.save(trx)
      await user.save(trx)

      await trx.commit()

      return response.status(201).send({ message: 'Instituicão alterada com sucesso' });
    } catch (err) {
      await trx.rollback()
      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  /**
   * Delete a instituicao with id.
   * DELETE instituicaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = InstituicaoController
