import { useEffect, useState } from "react";
import closeCategoriaModal from "../../assets/close-modal-categoria.svg";
import "./styles.scss";

type categorias = {
  descricao: string;
  handleMiniCategorias: () => void;
  categoriasAtivas: Array<String>;
};

export default function Categoria({
  descricao,
  handleMiniCategorias,
  categoriasAtivas,
}: categorias) {
  const [categoriaAplicada, setCategoriaAplicada] = useState(false);

  const handleClick = () => {
    setCategoriaAplicada(!categoriaAplicada);
    handleMiniCategorias();
  };

  useEffect(() => {
    if (categoriasAtivas.length === 0) {
      setCategoriaAplicada(false);
    }
  }, [categoriasAtivas]);

  return (
    <div
      onClick={handleClick}
      className={`miniContainer-categoria ${
        categoriaAplicada ? "categoria-aplicada" : ""
      }`}
    >
      <p>{descricao}</p>
      <img
        className={categoriaAplicada ? "" : "botao-mais"}
        src={closeCategoriaModal}
      />
    </div>
  );
}
