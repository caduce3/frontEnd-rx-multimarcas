import { api } from "@/lib/axios";

export interface PegarVendasBody {
    page: number;
    nome_cliente?: string;
    nome_funcionario?: string;
}

export interface PegarVendasResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    carrinhosList: {
        id: string;
        clienteId: string;
        funcionarioId: string;
        valorTotal: number;
        subtotal: number;
        desconto: number;
        dateCreated: string;
        dateUpdated: string;
        tipoPagamento: "CREDITO" | "DEBITO" | "DINHEIRO";
        itemCarrinho: {
            id: string;
            carrinhoId: string;
            produtoId: string;
            unidadesProduto: number;
            totalItemCarrinho: number;
            dateCreated: string;
            dateUpdated: string;
        }[];
        Clientes: {
            id: string;
            nome: string;
            email: string;
            telefone: string;
            cpf: string;
            dateCreated: string;
            dateUpdated: string;
        };
        Funcionario: {
            id: string;
            nome: string;
            email: string;
            telefone: string;
            cpf: string;
            status: string;
            cargo: string;
        };
    }[];
}


export async function pegarVendas({ page, nome_cliente, nome_funcionario }: PegarVendasBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<PegarVendasResponse>('/pegar_vendas', { page, nome_cliente, nome_funcionario }, {
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
