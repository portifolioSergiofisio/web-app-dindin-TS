import { FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseButton from "../../assets/close.svg";
import { handleConfirm } from "../../function/function";
import axios from "../../services/api";
import Button from "../Button";
import Input from "../Input";
import "./styles.scss";
const token = localStorage.getItem("token");

export default function ModalUsuario({ id = "close", onClose = () => {} }) {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleOutsideClick = (e:any) => {
    if (e.target.id === id) onClose();
  };

  const handleEditarUsuario = async (e:FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        "/usuario",
        {
          nome,
          email,
          senha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Informações do usuário foram atualizadas!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setEmail("");
      setNome("");
      setSenha("");
      setConfirmaSenha("");
    } catch (err:any) {
      toast.error(err.response.data.mensagem, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(()=>{
    async function getUserData() {
      const {data:{email, nome, id}} = await axios.get('/usuario',{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      setNome(nome)
      setEmail(email)      
    }

    getUserData()
  },[])

  return (
    <>
      <div id={id} className="modal" onClick={handleOutsideClick}>
        <div className="modal-container">
          <form onSubmit={handleEditarUsuario}>
            <h1>Editar Perfil</h1>
            <img
              src={CloseButton}
              className="close-btn"
              onClick={onClose}
              alt="Botão para fechar o modal."
            />
            <Input label="Nome" type="text" value={nome} set={setNome} />
            <Input label="Email" type="email" value={email} set={setEmail} />
            <Input label="Senha" type="password" value={senha} set={setSenha} />
            <Input
              label="Confirmação de senha"
              type="password"
              value={confirmaSenha}
              set={setConfirmaSenha}
            />
            <Button
              text="Confirmar"
              onClick={(e)=>handleConfirm(e, senha, confirmaSenha)}
            />
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
