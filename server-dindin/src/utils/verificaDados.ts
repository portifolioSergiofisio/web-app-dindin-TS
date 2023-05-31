import { Response } from "express";
import knex from "../connection";
import { dados } from "../types/types";

export function verificarDados(res: Response, objeto: dados) {
  for (let chave in objeto) {
    if (!chave) {
      res.status(400).json({ mensagem: `O campo '${chave}' é obrigatório!` });
      return false;
    }
  }
  return true;
}

export async function verificarEmailCadastrado(
  res: Response,
  { email }: dados
) {
  try {
    const usuario = await knex("usuarios").where({ email });
    return usuario;
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

export function somaValoresFiltrados(transacoes: any) {
  console.log(transacoes);

  const extrato = { entrada: 0, saida: 0 };
  transacoes.map((op: any) => {
    if (op.tipo === "entrada") {
      extrato.entrada += parseFloat(op.valor);
    } else if (op.tipo === "saida") {
      extrato.saida += parseFloat(op.valor);
    }
  });
  return extrato;
}
