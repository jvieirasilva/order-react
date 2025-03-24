import React, { useState } from "react";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 15;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setPasswordError("");

    if (!fullName || !email || !password || !confirmPassword || !role) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("A senha deve ter entre 8 e 15 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        fullName,
        email,
        password,
        role,
      };

      console.log("Usuário registrado:", newUser);

      alert("Conta criada com sucesso!");
      // Aqui você pode chamar um serviço para enviar os dados para o backend
    } catch (error) {
      setErrorMessage("Erro ao criar conta.");
      console.error("Erro no registro:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Criar Conta</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="Digite sua senha (8-15 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Redigite a Senha</label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <div className="text-danger">{passwordError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Conta</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        {/* Link para voltar ao login */}
        <div className="text-center mt-3">
          <a href="/login">Já tem uma conta? Faça login</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
