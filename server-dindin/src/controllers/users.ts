import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import knex from "../connection";
import { verificarEmailCadastrado } from "../utils/verificaDados";
const senhaJWT: Secret = process.env.SENHAJWT!;

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .insert({ nome, email, senha: senhaEncriptada })
      .returning("*");

    res.status(201).json(usuario[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const efetuarLogin = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await verificarEmailCadastrado(res, { email });
    const senhaCorreta = await bcrypt.compare(senha, usuario[0].senha);

    if (!senhaCorreta)
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)" });

    if (!senhaJWT) {
      throw new Error("Chave secreta não definida");
    }

    const token = jwt.sign({ id: usuario[0].id }, senhaJWT, {
      expiresIn: "1d",
    });

    const { senha: __, ...dadosUsuario } = usuario[0];

    return res.json({ usuario: dadosUsuario, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
