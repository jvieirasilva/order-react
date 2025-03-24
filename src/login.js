import React, { useState } from "react";
import { login } from "./services/authService"; // Importando a service de login
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Valida o e-mail em tempo real e remove o erro caso seja válido
    if (!validateEmail(value)) {
      setEmailError("Por favor, insira um e-mail válido.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setEmailError(""); // Reseta o erro do e-mail

    if (!email || !password) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }

    setLoading(true); // Exibir "Carregando..." no botão apenas se tudo estiver certo

    try {
      //const response = await login(email, password);
      const data = await login(email, password);
      //if (response) {
      if (data) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      
        //alert("Token armazenado:\n" + data.accessToken);


        //alert("Login bem-sucedido!");
        navigate("/products"); // 🔥 Redireciona para a rota /station

      } else {
        setErrorMessage("Usuário ou senha inválidos.");
      }
    } catch (error) {
      setErrorMessage("Erro ao conectar com o servidor.");
      console.error("Erro na autenticação:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`} // Adiciona borda vermelha se houver erro
              placeholder="Digite seu email"
              value={email}
              onChange={handleEmailChange} // Agora valida em tempo real
              required
            />
            {emailError && <div className="text-danger">{emailError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </button>

          {/* Link para registro */}
          
        </form>
      </div>
    </div>
  );
}

export default Login;
