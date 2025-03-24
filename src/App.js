import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Importando Bootstrap

import Login from "./login";        
import Register from "./register";  
import ProductTable from "./pages/ProductTable";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./pages/CartContext"; // Certifique-se de que está correto

function App() {
  return (
    <CartProvider> {/* Envolvendo a aplicação para garantir acesso ao carrinho */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductTable />} />
          <Route path="/" element={<Login />} /> 
          <Route path="/product/:id" element={<ProductDetails />} />   
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
