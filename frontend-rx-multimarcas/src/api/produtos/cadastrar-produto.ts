import { api } from "@/lib/axios";

export interface CadastrarProdutoBody {
    nome: string;
    descricao: string;
    preco: number;
    quantidadeDisponivel: number;
}

export async function CadastrarProduto({ nome, descricao, preco, quantidadeDisponivel }: CadastrarProdutoBody) {
    try {
        const response = await api.post('/cadastrar_produto', { nome, descricao, preco, quantidadeDisponivel });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao cadastrar produto.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}