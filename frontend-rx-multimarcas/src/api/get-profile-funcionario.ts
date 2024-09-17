import { api } from "@/lib/axios";

interface Funcionario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    status: "ATIVO" | "INATIVO";
    cargo: "PROPRIETARIO" | "COLABORADOR" | "ADMINISTRADOR";
}

export interface GetProfileFuncionarioResponse {
    funcionario: Funcionario;
}

export async function getProfileFuncionario() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<GetProfileFuncionarioResponse>('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.funcionario;
    } catch (error) {
        throw new Error('Failed to fetch user profile');
    }
}
