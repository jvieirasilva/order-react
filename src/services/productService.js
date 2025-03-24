import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/products?name=`;

export const fetchProducts = async (token, name = "") => {

  const response = await fetch(API_URL+`${name}&page=0&size=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
  
    const data = await response.json();
    return data.content;
  };
  