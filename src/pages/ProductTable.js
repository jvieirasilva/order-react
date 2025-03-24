import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { CartContext } from "./CartContext";
import { fetchProducts } from "../services/productService";



const ProductTable = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken");

  // Verificar autenticação logo no início do componente
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

    // Função para fazer logout
    const handleLogout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate('/login');
    };

  // 🔍 Fetch com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!token) return;

      fetchProducts(token, searchTerm)
        .then((data) => {
          const productsData = Array.isArray(data) ? data : data?.content ?? [];
          setProducts(productsData);
          filterProducts(productsData, searchTerm);
        })
        .catch((err) => console.error("Erro ao buscar produtos:", err));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, token]);

  // Função para filtrar produtos localmente (caso backend não filtre corretamente)
  const filterProducts = (products, term) => {
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    // Normaliza o termo de busca (remove acentos e converte para minúsculo)
    const normalizedTerm = removeAccents(term.toLowerCase().trim());
    
    const filtered = products.filter(product => {
      if (!product.name) return false;
      
      // Normaliza o nome do produto
      const normalizedName = removeAccents(product.name.toLowerCase().trim());
      
      return normalizedName.includes(normalizedTerm);
    });
    
    setFilteredProducts(filtered);
  };

  // Função para remover acentos de uma string
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Manipulador para busca local
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Se o backend não estiver filtrando, podemos filtrar localmente
    // filterProducts(products, term);
  };

  const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  // Usar produtos filtrados em vez dos produtos originais
  const groupedProducts = chunkArray(filteredProducts.length > 0 ? filteredProducts : products, 3);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Produtos Disponíveis</h2>

      

      <div className="d-flex justify-content-between align-items-center mb-3">
     

        <input
          type="text"
          placeholder="Buscar produto..."
          className="form-control w-25"
          value={searchTerm}
          onChange={handleSearch}
        />

        <Button 
          variant="danger" 
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered" id="productTable">
          <thead>
            <tr>
              <th colSpan="3" className="text-center">Lista de Produtos</th>
            </tr>
          </thead>
          <tbody>
            {groupedProducts.length > 0 ? (
              groupedProducts.map((group, rowIndex) => (
                <tr key={rowIndex}>
                  {[...group, ...Array(3 - group.length).fill(null)].map((product, index) =>
                    product ? (
                      <td key={product.id} className="product-cell">
                        <div className="product-content">
                          <span
                            className="product-name clickable"
                            onClick={() =>
                              navigate(`/product/${product.id}`, { state: { product } })
                            }
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline"
                            }}
                          >
                            {product.name}
                          </span>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="product-image"
                          />
                          <p className="mt-2">€ {product.price}</p>
                          
                        </div>
                      </td>
                    ) : (
                      <td key={`empty-${index}`} className="product-cell empty-cell" />
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .product-cell {
          width: 33%;
          vertical-align: top;
        }

        .product-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-image {
          width: 260px;
          height: 260px;
          object-fit: contain;
          margin-top: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: white;
          padding: 5px;
        }

        .clickable:hover {
          color: darkblue;
        }

        .empty-cell {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default ProductTable;