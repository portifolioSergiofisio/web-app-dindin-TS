import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function ProtectedRoutes({ redirectTo }: { redirectTo: string }): JSX.Element {  
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function UsuarioLogado({ redirectTo }: { redirectTo: string }): JSX.Element {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
}

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<UsuarioLogado redirectTo="/home" />}>
        <Route path="/" element={<Header logado={false} />}>
          <Route path="" element={<Login />} />
        </Route>
        <Route path="/cadastro" element={<Header logado={false} />}>
          <Route path="" element={<Cadastro />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes redirectTo="/" />}>
        <Route path="/home" element={<Header logado={true} />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
