import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { Carousel, Button } from "react-bootstrap";

const ProductDetails = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Obtém o produto passado na navegação
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

  if (!product) {
    return <div className="container mt-4"><h2>Produto não encontrado!</h2></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{product.name}</h2>
        <Button 
          variant="danger" 
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </Button>
      </div>

      <Carousel className="product-carousel">
        {product.images.map((img, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100 product-image" src={img} alt={`Imagem ${index + 1}`} />
          </Carousel.Item>
        ))}
      </Carousel>

      <p className="product-price"> € {product.price}</p>

      <div className="mt-3">
        <Link to="/products" className="btn btn-secondary">Voltar</Link>
      </div>

      <style>
        {`
          .product-carousel {
            max-width: 500px;
            margin: 0 auto;
          }
          .product-image {
            max-width: 100%;
            object-fit: contain;
          }
          .product-price {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
          }
          .product-description {
            text-align: center;
            margin-top: 10px;
          }
          .add-to-cart-btn {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 20px auto;
          }
          .logout-btn {
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetails;