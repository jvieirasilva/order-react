import React, { useState, useEffect } from "react";
import axios from "axios";

const StationTable = () => {
  const [stations, setStations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Definindo tamanho da página

  useEffect(() => {
    fetchStations(currentPage);
  }, [currentPage]); // 🔥 Agora sempre busca dados quando `currentPage` mudar

  const fetchStations = async (page) => {
    const token = localStorage.getItem("accessToken"); // Pegando token do localStorage

    if (!token) {
        alert("Token não encontrado! Faça login novamente.");
        return;
    }

    console.log("🔍 Buscando página:", page); // 🔥 Debug para verificar o valor de page

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const payload = {
        page: page,
        size: pageSize,
    };

    // 🔥 Construindo a URL com parâmetros para debug
    const queryParams = new URLSearchParams({
        page: payload.page,
        size: payload.size,
    });

    const fullUrl = `http://localhost:8081/stations/station?${queryParams.toString()}`;
    
    // ✅ Exibir a URL e os parâmetros
    console.log("🚀 URL completa da requisição:", fullUrl);
    console.log("📦 Payload enviado:", JSON.stringify(payload, null, 2));

    //alert(`📌 URL completa:\n${fullUrl}\n\n📦 Payload:\n${JSON.stringify(payload, null, 2)}`);

    try {
        const response = await axios.post(fullUrl, payload, { headers });

        if (response.data) {
            setStations(response.data.content);
            setTotalPages(response.data.totalPages);
        }
    } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
        alert("Erro ao buscar dados. Verifique o console.");
    }
};

  // 🔥 Atualiza a página corretamente antes de chamar `fetchStations`
  const handlePageClick = (pageIndex) => {
    console.log("🆕 Página clicada:", pageIndex);
    setCurrentPage(pageIndex);
    fetchStations(pageIndex); // 🔥 Chama `fetchStations` imediatamente com o valor correto
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Estações</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Serial</th>
            <th>Status Online</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? (
            stations.map((station) => (
              <tr key={station.id}>
                <td>{station.id}</td>
                <td>{station.serial}</td>
                <td>{station.onLineStatus ? "Online" : "Offline"}</td>
                <td>{station.stateDTO ? station.stateDTO.description : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Nenhuma estação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginação */}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* Botão Anterior */}
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
              Anterior
            </button>
          </li>

          {/* Botões das páginas */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${index === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => handlePageClick(index)}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* Botão Próximo */}
          <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
              Próxima
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StationTable;
