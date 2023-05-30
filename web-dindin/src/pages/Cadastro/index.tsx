import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import axios from "../../services/api";
import "./styles.scss";

export default function Cadastro() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleSubmit = async (e:FormEvent ) => {
    e.preventDefault();
    try {
      await axios.post("/usuario", {
        nome,
        email,
        senha,
      });
      setEmail("");
      setNome("");
      setSenha("");
      toast.success("Cadastro realizado com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err:any) {
      toast.error(err.response.data.mensagem, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleConfirm = (e:FormEvent, senha:string, confirmaSenha:string) => {
    e.preventDefault();
    if (senha !== confirmaSenha) {
      toast.error("As senhas devem ser iguais!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return 
    }
  };

  return (
    <div className="container-login cadastro">
      <ToastContainer />
      <div className="container-r">
        <h2>Cadastre-se</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Nome" type="text" value={nome} set={setNome} />
          <Input label="Email" type="email" value={email} set={setEmail} />
          <Input label="Senha" type="password" value={senha} set={setSenha} />
          <Input
            label="Confirmação de senha"
            type="password"
            set={setConfirmaSenha}
          />
          <Button
            text="Cadastrar"
            onClick={(e) => handleConfirm(e, senha, confirmaSenha)}
          />
        </form>
        <p>
          Já tem cadastro? <Link to="/">Clique aqui!</Link>
        </p>
      </div>
    </div>
  );
}
