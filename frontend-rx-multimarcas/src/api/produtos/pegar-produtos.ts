import { api } from "@/lib/axios";

export interface PegarProdutosBody {
    page: number;
    nome?: string;
    descricao?: string;
    preco?: number;
    quantidadeDisponivel?: number;
}

export interface PegarProdutosResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    produtosList: {
        id: string;
        nome: string;
        descricao: string;
        preco: number;
        quantidadeDisponivel: number;
    }[]
}

export async function pegarProdutos({ page, nome, descricao, preco, quantidadeDisponivel }: PegarProdutosBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<PegarProdutosResponse>('/pegar_produtos', { page, nome, descricao, preco, quantidadeDisponivel }, {
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
