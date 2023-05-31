import { NextFunction, Request, Response } from "express";

export type dados = {
  nome?: string | undefined;
  email?: string | undefined;
  senha?: string | undefined;
  descricao?: string;
  valor?: number;
  data?: string;
  categoria_id?: number;
  tipo?: string;
};

export type funcao = {
  req: Request;
  res: Response;
  next?: NextFunction;
};

export interface TokenPayload {
  id: string;
}

export interface CustomRequest extends Request {
  usuario?: any;
  categoriaAtual?: any;
}
