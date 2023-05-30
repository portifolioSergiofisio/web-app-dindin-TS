import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Editar from "../../assets/editar.svg";
import Excluir from "../../assets/excluir.svg";
import setaFiltro from "../../assets/seta-filtro.svg";
import axios from "../../services/api";
import "./styles.scss";
const token = localStorage.getItem("token");

type Table = {
  setTransacoes:Dispatch<SetStateAction<any>>,
  setTransacaoAtual:Dispatch<SetStateAction<any>>,
  setAtualizacao:Dispatch<SetStateAction<any>>
  setModalAberto:Dispatch<SetStateAction<boolean>>
  setTipoOperacao:Dispatch<SetStateAction<string>>
  transacoes:any,
  transacaoAtual:any
  atualizacao:any
  tipoOperacao:string
  filtroAparecendo:boolean
}

export default function Table({
  setTransacoes,
  transacoes,
  transacaoAtual,
  setTransacaoAtual,
  atualizacao,
  setAtualizacao,
  setModalAberto,
  tipoOperacao,
  setTipoOperacao,
  filtroAparecendo,
}:Table) {
  const cabecalhoTabela = [
    "Dia da semana",
    "Descrição",
    "Categoria",
    "Valor",
    " ",
  ];
  const diaDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const [ordenaData, setOrdenaData] = useState(false);

  function handleMiniModal(e:FormEvent, transacao:any) {
    setTransacaoAtual(transacao.id);
    setTipoOperacao("deletar");
    e.stopPropagation();
  }

  async function handleDeleteTransac() {
    try {
      await axios.delete(`/transacao/${transacaoAtual}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAtualizacao(atualizacao + 1);
    } catch (error:any) {
      console.log(error.message);
    }
  }

  const handleModalAberto = (e:FormEvent, transacao:any) => {
    setTransacaoAtual(transacao.id);
    setModalAberto(true);
    setTipoOperacao("editar");
    e.stopPropagation();
  };

function handleOrdenaPorData() {
  let transacoesOrdenadas = [...transacoes]; 
  if (ordenaData) {
    transacoesOrdenadas = transacoesOrdenadas.sort((a: any, b: any) => {
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  } else {
    transacoesOrdenadas = transacoesOrdenadas.sort((a: any, b: any) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }
  setTransacoes(transacoesOrdenadas);
  setOrdenaData(!ordenaData);
}



  useEffect(() => {}, [transacoes]);

  return (
    <div className="tabela">
      <div className="cabecalho-tabela">
        <div className="data-seta" onClick={handleOrdenaPorData}>
          <p>Data</p>
          <img
            className={ordenaData ? "" : "seta-invertida"}
            src={setaFiltro}
            alt="Seta para ordenação da lista"
          />
        </div>
        {cabecalhoTabela.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
      <div
        className="corpo-tabela"
        style={filtroAparecendo ? { height: "400px" } : { height: "70vh" }}
      >
        {transacoes &&
          transacoes.map((transacao:any, index:number) => {
            return (
              <div className="linha-tabela" key={index}>
                <p>
                  {new Date(transacao.data).toLocaleString("pt-BR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </p>
                <p>{diaDaSemana[new Date(transacao.data).getDay()]}</p>
                <p>{transacao.descricao}</p>
                <p>{transacao.categoria_nome}</p>
                <p
                  className={
                    transacao.tipo === "entrada"
                      ? "valor-entrada"
                      : "valor-saida"
                  }
                >
                  {(transacao.valor / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <div className="editar-excluir">
                  <img
                    src={Editar}
                    alt="Ícone de editar."
                    onClick={(e) => handleModalAberto(e, transacao)}
                  />
                  <img
                    src={Excluir}
                    alt="Ícone de excluir."
                    onClick={(e) => handleMiniModal(e, transacao)}
                  />
                  <div
                    className={`miniModal ${
                      transacao.id === transacaoAtual &&
                      tipoOperacao !== "editar"
                        ? ""
                        : "escondido"
                    }`}
                  >
                    <p>Apagar item?</p>
                    <div className="apagar-transac">
                      <button onClick={handleDeleteTransac}>Sim</button>
                      <button>Não</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
