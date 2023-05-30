import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "../../services/api";
import "./styles.scss";
const token = localStorage.getItem("token");

import Categoria from "../Categoria";

type Filter = {
  setTransacoes:Dispatch<SetStateAction<any>>,
  transacoes:any,
  setAtualizacao:Dispatch<SetStateAction<number>>,
  atualizacao:number,
  categoriasAtivas:any,
  setCategoriasAtivas:Dispatch<SetStateAction<any>>,
  filtroAplicado:boolean,
  setFiltroAplicado:Dispatch<SetStateAction<boolean>>,
}

export default function Filter({
  setTransacoes,
  transacoes,
  setAtualizacao,
  atualizacao,
  categoriasAtivas,
  setCategoriasAtivas,
  filtroAplicado,
  setFiltroAplicado,
}:Filter) {
  
  const [categorias, setCategorias]:any = useState();

  async function handleListarCategorias():Promise<void> {
    try {
      const { data } = await axios.get("/usuario/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(data);
    } catch (error:any) {
      console.log(error.response.data.mensagem);
    }
  }

  function handleMiniCategorias(descricao:any) {
    console.log(descricao);
    
    let newCategoriasAtivas = categoriasAtivas;
    if (categoriasAtivas.includes(descricao)) {
      const index = categoriasAtivas.indexOf(descricao);
      newCategoriasAtivas.splice(index, 1);
    } else {
      newCategoriasAtivas = [...categoriasAtivas, descricao];
    }
    setCategoriasAtivas(newCategoriasAtivas);
  }

  function handleLimparFiltro() {
    setCategoriasAtivas([]);
    setFiltroAplicado(false);
    setAtualizacao(atualizacao + 1);
  }

  function handleAplicarFiltro() {
    setFiltroAplicado(true);
    setAtualizacao(atualizacao + 1);
    let transacoesFiltradas = [...transacoes];
    transacoesFiltradas = transacoesFiltradas.filter((filtro:any) => {
      return categoriasAtivas.includes(filtro.categoria_nome);
    });
    setTransacoes(transacoesFiltradas);
    if (categoriasAtivas.length === 0) setFiltroAplicado(false);
  }

  useEffect(() => {
    handleListarCategorias();
  }, [atualizacao]);

  return (
    <div className="container-filtro">
      <div className="wrap-categorias-botoes">
        <strong>Categoria</strong>
        <div className="container-categorias">
          {categorias &&
            categorias.map((categoria:any, index:number) => {
              return (
                <Categoria
                  descricao={categoria}
                  key={index}
                  handleMiniCategorias={() => handleMiniCategorias(categoria)}
                  categoriasAtivas={categoriasAtivas}
                />
              );
            })}
        </div>
        <div className="container-botoes">
          <button onClick={handleLimparFiltro}>Limpar Filtros</button>
          <button
            className={filtroAplicado ? "botao-roxo" : ""}
            onClick={handleAplicarFiltro}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
