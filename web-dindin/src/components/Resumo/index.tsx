import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "../../services/api";
import Button from "../Button";
import "./styles.scss";
const token = localStorage.getItem("token");

type Props = {
  atualizacao: string|number;
  setModalAberto: Dispatch<SetStateAction<boolean>>;
  setTipoOperacao: Dispatch<SetStateAction<any>>;
  categoriasAtivas: any;
};

export default function Resumo({
  atualizacao,
  setModalAberto,
  setTipoOperacao,
  categoriasAtivas
}:Props) {
  const [entrada, setEntrada] = useState<number>(0);
  const [saida, setSaida] = useState<number>(0);

  async function handleResumo() {
    try {
      
      let parametros:any = "";
      parametros = categoriasAtivas.map((cat:string, index:number) => {
        if (index < categoriasAtivas.length - 1) {
          return parametros.concat(`filtro[]=${cat}&`);
        } else {
          return parametros.concat(`filtro[]=${cat}`);
        }
      });
      parametros = `?${parametros.join("")}`;
      const { data } = await axios.get(`/transacao/extrato${parametros ? parametros : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntrada(data.entrada);
      setSaida(data.saida);
    } catch (error) {}
  }

  const handleModalAberto = () => {
    
    setModalAberto(true);
    setTipoOperacao("cadastrar");
  };

  useEffect(() => {
    handleResumo();
  }, [atualizacao]);

  return (
    <div className="container-resumo">
      <div className="resumo">
        <h3>Resumo</h3>
        <div className="resumo-linha">
          <p>Entradas</p>
          {
            <p className="valor-entrada">
              {entrada &&
                (entrada / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </p>
          }
        </div>
        <div className="resumo-linha">
          <p>Saídas</p>
          {
            <p className="valor-saida">
              {saida &&
                (saida / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </p>
          }
        </div>
        <hr className="divisor" />
        <div className="resumo-linha">
          <p>Saldo</p>
          {
            <p
              className={
                (entrada&&saida) && entrada - saida < 0
                  ? "valor-saida"
                  : "saldo-positivo"
              }
            >
              {(entrada&&saida) &&
                ((entrada - saida) / 100).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}
            </p>
          }
        </div>
      </div>
      <Button 
      text="Adicionar Registro" 
      onClick={handleModalAberto} />
    </div>
  );
}
