import { Dispatch, SetStateAction } from "react";

export type filter = {
  setTransacoes: Dispatch<SetStateAction<any>>;
  transacoes: object;
  setAtualizacao: Dispatch<SetStateAction<number>>;
  atualizacao: number;
  categoriasAtivas: Array<string>;
  setCategoriasAtivas: Dispatch<SetStateAction<any>>;
  filtroAplicado: boolean;
  setFiltroAplicado: Dispatch<SetStateAction<boolean>>;
};

export type categoriesFilter = {
  categoria_id: number;
  categoria_nome: string;
  data: string;
  descricao: string;
  id: number;
  tipo: string;
  usuario_id: number;
  valor: number;
};
