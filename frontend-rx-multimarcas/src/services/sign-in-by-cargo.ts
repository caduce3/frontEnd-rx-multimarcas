import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
    id: string;
    cargo: "PROPRIETARIO" | "ADMINISTRADOR" | "COLABORADOR";
}

export const signInByCargo = (token: string) => {
    if (!token) {
        return null;
    }

    const decodedToken = jwtDecode<MyTokenPayload>(token);

    const cargosMap: { [key: string]: string } = {
        PROPRIETARIO: "/",
        ADMINISTRADOR: "/",
        COLABORADOR: "/"
    };

    // Verifica se o setor é válido e retorna o valor correspondente
    return cargosMap[decodedToken.cargo] || false;
};
