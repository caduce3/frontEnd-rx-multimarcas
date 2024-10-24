import { api } from "@/lib/axios";

export interface PegarUnicoProdutoBody {
    id_produto: string;
}

export interface PegarUnicoProdutoResponse {
    produto: {
        id: string;
        nome: string;
        descricao: string;
        preco: number;
        quantidadeDisponivel: number;
        dateCreated: Date;
        dateUpdated: Date;
    }
}

export async function pegarUnicoProduto({ id_produto }: PegarUnicoProdutoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<PegarUnicoProdutoResponse>(`/produtos/${id_produto}`, {
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
