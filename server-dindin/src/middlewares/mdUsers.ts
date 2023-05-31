import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import knex from "../connection";
import { CustomRequest, TokenPayload, dados } from "../types/types";
import {
  verificarDados,
  verificarEmailCadastrado,
} from "../utils/verificaDados";
const senhaJwt: string | undefined = process.env.SENHAJWT;

export const verificarDadosCadastro = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let { nome, email, senha }: dados = req.body;

  if (
    !verificarDados(res, {
      nome: nome?.trim(),
      email: email?.trim(),
      senha: senha?.trim(),
    })
  )
    return;

  const emailCadastrado = await verificarEmailCadastrado(res, { email });
  if (emailCadastrado.length > 0) {
    return res.status(400).json({ mensagem: "Email ou senha inválido(s)" });
  }

  next();
};

export const verificarDadosLogin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, senha } = req.body;

  if (!verificarDados(res, { email, senha })) return;

  const emailCadastrado = await verificarEmailCadastrado(res, { email });
  if (emailCadastrado.length <= 0) {
    return res.status(400).json({ mensagem: "Email ou senha inválido(s)" });
  }

  next();
};

export const verificarLogin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }
  const token = authorization.split(" ")[1];
  try {
    if (!senhaJwt) {
      return res.status(401).json({ mensagem: "Chave JWT não fornecida." });
    }
    const { id } = verify(token, senhaJwt) as TokenPayload;

    const usuario = await knex("usuarios").where({ id });

    if (usuario.length <= 0)
      return res.status(403).json({ mensagem: "Não autorizado" });
    const { senha: _, ...dadosUsuario } = usuario[0];
    console.log(dadosUsuario);

    req.usuario = dadosUsuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Ops, sua sessão expirou!",
    });
  }
};
