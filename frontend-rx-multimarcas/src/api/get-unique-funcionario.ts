import { api } from "@/lib/axios";

export interface GetUniqueFuncionarioBody {
    id: string;
}

export interface GetUniqueFuncionarioResponse {
    funcionario: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
        status: "ATIVO" | "INATIVO";
        cargo: "PROPRIETARIO" | "ADMINISTRADOR" | "COLABORADOR";
    }
}

export async function getDetailsFuncionario({ id }: GetUniqueFuncionarioBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<GetUniqueFuncionarioResponse>(`/pegar_unico_funcionario/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}


