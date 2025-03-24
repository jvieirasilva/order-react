import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/auth/authenticate`;

export const login = async (email, password) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("🔍 Headers completos:", [...response.headers.entries()]);

    if (!response.ok) {
      throw new Error("Erro ao autenticar. Verifique suas credenciais.");
    }

    const userData = await response.json();

    const accessTokenHeader = response.headers.get("authorization"); // Ex: "Bearer eyJhb..."
    const refreshTokenHeader = response.headers.get("refresh-token");

    const accessToken = accessTokenHeader?.replace("Bearer ", "");

    return {
      user: userData,
      accessToken,
      refreshToken: refreshTokenHeader,
    };
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    return null;
  }
};
