import { FormEvent } from "react";
import { toast } from "react-toastify";

  export const handleConfirm = (e:FormEvent, senha:string, confirmaSenha:string) => {
    if (senha !== confirmaSenha) {
      toast.error("As senhas devem ser iguais!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return e.preventDefault();
    }
  };