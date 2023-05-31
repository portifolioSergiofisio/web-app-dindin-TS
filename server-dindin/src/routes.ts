import express from "express";
import {
  atualizarTransacaoLogado,
  atualizarUsuarioLogado,
  cadastrarTransacaoLogado,
  deletarTransacaoLogado,
  detalharTransacaoLogado,
  detalharUsuarioLogado,
  extratoTransacaoLogado,
  listarCategorias,
  listarCategoriasUsuario,
  listarTransacoesLogado,
} from "./controllers/userLogado";
import { cadastrarUsuario, efetuarLogin } from "./controllers/users";
import {
  verificarAtualizacaoCadastro,
  verificarTransacao,
  verificarUsuarioTransacao,
} from "./middlewares/mdUserLogado";
import {
  verificarDadosCadastro,
  verificarDadosLogin,
  verificarLogin,
} from "./middlewares/mdUsers";
const rota = express();

rota.post("/usuario", verificarDadosCadastro, cadastrarUsuario);
rota.post("/login", verificarDadosLogin, efetuarLogin);

rota.use(verificarLogin);

rota.get("/usuario", detalharUsuarioLogado);
rota.get("/transacao/extrato", extratoTransacaoLogado);
rota.get("/transacao/:id", detalharTransacaoLogado);
rota.post("/transacao", verificarTransacao, cadastrarTransacaoLogado);
rota.put("/usuario", verificarAtualizacaoCadastro, atualizarUsuarioLogado);
rota.get("/categoria", listarCategorias);
rota.get("/transacao", listarTransacoesLogado);
rota.put(
  "/transacao/:id",
  verificarTransacao,
  verificarUsuarioTransacao,
  atualizarTransacaoLogado
);
rota.delete(
  "/transacao/:id",
  verificarUsuarioTransacao,
  deletarTransacaoLogado
);

rota.get("/usuario/categoria", listarCategoriasUsuario);

export default rota;
