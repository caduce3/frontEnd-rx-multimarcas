import { api } from "@/lib/axios";

export interface GetFuncionariosBody {
    page: number;
    nome?: string;
    email?: string;
}

export interface GetFuncionariosResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    funcionariosList: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
        status: "ATIVO" | "INATIVO";
        cargo: "PROPRIETARIO" | "COLABORADOR" | "ADMINISTRADOR";
    }[]
}

export async function getFuncionarios({ page, nome, email }: GetFuncionariosBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GetFuncionariosResponse>('/pegar_funcionarios', { page, nome, email }, {
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
