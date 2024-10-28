import { jwtDecode } from "jwt-decode"

interface MyTokenPayload {
    id: string;
    cargo: string;
}

type CargosPermitidos = "PROPRIETARIO" | "COLABORADOR" | "ADMINISTRADOR";

export const verifyAccessByJwt = (token: string, cargosPermitidos: CargosPermitidos[]) => {

    if (!token || token == '') {
        return null;
    }

    const decodToken = jwtDecode<MyTokenPayload>(token);

    if (!cargosPermitidos.includes(decodToken.cargo as CargosPermitidos)) {
        return false;
    }

    return true;
}