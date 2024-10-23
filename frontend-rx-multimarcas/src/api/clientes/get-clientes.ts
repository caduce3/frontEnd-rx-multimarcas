import { api } from "@/lib/axios";

export interface GetClientesBody {
    page: number;
    nome?: string;
    telefone?: string;
    email?: string;
    cpf?: string;
}

export interface GetClientesResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    clientesList: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
    }[]
}

export async function getClientes({ page, nome, email, telefone, cpf }: GetClientesBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GetClientesResponse>('/pegar_clientes', { page, nome, email, telefone, cpf }, {
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
