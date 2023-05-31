import { Request, Response } from "express";
import { CustomRequest } from "../types/types";
import { somaValoresFiltrados } from "../utils/verificaDados";

import bcrypt from "bcrypt";
import knex from "../connection";

export const detalharUsuarioLogado = (req: CustomRequest, res: Response) => {
  return res.status(200).json(req.usuario);
};

export const extratoTransacaoLogado = async (
  req: CustomRequest,
  res: Response
) => {
  console.log("16");

  const { filtro } = req.query;
  const { id } = req.usuario!;
  const resposta = [];
  console.log("21");

  try {
    console.log("24");
    const transacoes = await knex("transacoes as t")
      .leftJoin("categorias as c", "c.id", "t.categoria_id")
      .sum("t.valor as valor")
      .select("c.descricao", "t.tipo")
      .where("usuario_id", id)
      .groupBy("c.descricao", "t.tipo");

    if (filtro) {
      if (Array.isArray(filtro)) {
        for (let element of filtro) {
          for (let transacao of transacoes) {
            if (transacao.descricao === element) {
              resposta.push(transacao);
            }
          }
        }
      } else {
        for (let transacao of transacoes) {
          if (transacao.descricao === filtro) {
            resposta.push(transacao);
          }
        }
      }
      return res.json(somaValoresFiltrados(resposta));
    }

    return res.json(somaValoresFiltrados(transacoes));
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const detalharTransacaoLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { id: transacao_id } = req.params;
  const { id } = req.usuario!;

  try {
    const transacao = await knex("transacoes as t")
      .leftJoin("categorias as c", "c.id", "t.categoria_id")
      .select(
        "t.id",
        "t.tipo",
        knex.raw("coalesce(t.descricao, 'sem descricao') as descricao"),
        knex.raw("cast(t.valor as float)"),
        "t.data_transacao as data",
        "t.usuario_id",
        "c.descricao AS categoria_nome"
      )
      .where("t.usuario_id", id)
      .andWhere("t.id", transacao_id);

    if (transacao.length <= 0)
      return res.status(400).json({ mensagem: "Transação não encontrada" });

    return res.json(transacao[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const cadastrarTransacaoLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.usuario!;
  const {
    descricao,
    valor,
    data: data_transacao,
    categoria_id,
    tipo,
  } = req.body;
  const { descricao: categoria_nome } = req.categoriaAtual!;

  try {
    const transacao = await knex("transacoes")
      .insert({
        tipo,
        descricao,
        valor,
        data_transacao,
        usuario_id: id,
        categoria_id,
      })
      .returning("*");

    if (transacao.length <= 0)
      return res.status(400).json({ mensagem: "Operação falhou!" });

    const resposta = {
      id: transacao[0].id,
      tipo,
      descricao,
      valor: parseFloat(valor),
      data: data_transacao,
      usuario_id: id,
      categoria_id,
      categoria_nome,
    };

    return res.json({ ...resposta });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const atualizarUsuarioLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario!;

  try {
    const senhaEncriptada = await bcrypt.hash(senha, 10);

    await knex("usuarios")
      .update({ nome, email, senha: senhaEncriptada })
      .where({ id });

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarCategorias = async (_: Request, res: Response) => {
  try {
    const categorias = await knex("categorias");

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarTransacoesLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.usuario!;
  const { filtro } = req.query;
  const resposta = [];

  try {
    const transacoes = await knex("transacoes as t")
      .leftJoin("categorias as c", "c.id", "t.categoria_id")
      .select(
        "t.id",
        "t.tipo",
        "t.descricao",
        knex.raw("cast(t.valor as float)"),
        "t.data_transacao as data",
        "t.usuario_id",
        "t.categoria_id",
        "c.descricao AS categoria_nome"
      )
      .where("t.usuario_id", id);

    if (filtro) {
      if (Array.isArray(filtro)) {
        for (let element of filtro) {
          for (let transacao of transacoes) {
            if (transacao.categoria_nome === element) {
              resposta.push(transacao);
            }
          }
        }
      } else {
        for (let transacao of transacoes) {
          if (transacao.categoria_nome === filtro) {
            resposta.push(transacao);
          }
        }
      }
      return res.json(resposta);
    }

    return res.json(transacoes);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const atualizarTransacaoLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const {
    descricao,
    valor,
    data: data_transacao,
    categoria_id,
    tipo,
  } = req.body;

  try {
    await knex("transacoes")
      .update({ descricao, valor, data_transacao, categoria_id, tipo })
      .where({ id });

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const deletarTransacaoLogado = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    await knex("transacoes").del().where({ id });

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarCategoriasUsuario = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.usuario!;
  const resposta: any = [];

  try {
    const categorias = await knex("transacoes as t")
      .leftJoin("categorias as c", "c.id", "t.categoria_id")
      .select("c.descricao as descricao")
      .where({ id })
      .groupBy("c.descricao");

    if (categorias.length <= 0)
      return res
        .status(404)
        .json({ mensagem: "Usuário sem transações cadastradas!" });

    categorias.map((resp: any) => {
      resposta.push(resp.descricao);
    });

    return res.json(resposta);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};
