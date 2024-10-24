import { api } from "@/lib/axios";

export interface AtualizarProdutoBody {
    id_produto: string;
    nome?: string;
    descricao?: string;
    preco?: number;
    quantidadeDisponivel?: number;
}

export async function atualizarProduto({ id_produto, nome, descricao, preco, quantidadeDisponivel }: AtualizarProdutoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.put(`/atualizar_produto`, 
            { id_produto, nome, descricao, preco, quantidadeDisponivel }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error: any) {
        // Se a API retorna uma resposta com um formato específico de erro
        if (error.response && error.response.data) {
            // Exiba a mensagem de erro da resposta da API
            throw new Error(error.response.data.message || 'Erro desconhecido ao atualizar produto.');
        } else {
            // Caso o erro não seja uma resposta da API (por exemplo, problemas de rede)
            throw new Error('Erro ao conectar com o servidor ou erro desconhecido.');
        }
    }
}
