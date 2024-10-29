import { api } from "@/lib/axios";

export interface cadastrarVendaBody {
    clienteId: string,
    funcionarioId: string,
    tipoPagamento: "CREDITO" | "DEBITO" | "DINHEIRO",
    desconto: number,
    itens: {
        produtoId: string,
        unidadesProduto: number,
    }[]
}

export async function cadastrarVenda({ clienteId, funcionarioId, tipoPagamento, desconto, itens }: cadastrarVendaBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post('/cadastrar_venda', 
            { clienteId, funcionarioId, tipoPagamento, desconto, itens },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao cadastrar venda.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
